import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  USER_COOKIE_EXPIRY,
  USER_TEMPORARY_TOKEN_EXPIRY,
} from "../constants.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import crypto from "crypto";
import { sendEmail } from "../utils/emails/sendEmail.js";
import {
  forgotPasswordEmailTemplate,
  forgotPasswordPlainTextTemplate,
} from "../utils/emails/forgotPasswordTemplate.js";

// generate temporary otp token
function generateTemporaryOTPToken() {
  const min = 100000;
  const max = 999999;
  const unHashedOTP = crypto.randomInt(min, max + 1).toString();

  const hashedOTP = crypto
    .createHash("sha256")
    .update(unHashedOTP)
    .digest("hex");

  const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;

  return { unHashedOTP, hashedOTP, tokenExpiry };
}

// generate user accessToken and refreshToken
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

// register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  if ([name, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  let profileImageUrl = "";
  let profileImagePublicId = "";
  const profileImageLocalPath = req.file?.path;

  if (profileImageLocalPath) {
    const uploadedImage = await uploadOnCloudinary(profileImageLocalPath);
    if (!uploadedImage.url) {
      throw new ApiError(400, "Error when profile image upload on cloudinary!");
    } else {
      profileImageUrl = uploadedImage.url;
      profileImagePublicId = uploadedImage.public_id;
    }
  }

  const user = await User.create({
    name: name.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    profileImage: {
      public_id: profileImagePublicId,
      url: profileImageUrl,
    },
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or username

  if (!identifier) {
    throw new ApiError(400, "Email or Username is required");
  }

  // Check if identifier is email or username
  const isEmail = identifier.includes("@");

  const user = await User.findOne(
    isEmail ? { email: identifier } : { username: identifier.toLowerCase() }
  );

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: USER_COOKIE_EXPIRY,
  };

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in successfully"
      )
    );
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout successfully"));
});

// refreshAccessToken
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or already used");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefereshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});

// forgot password request
const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const { hashedOTP, unHashedOTP, tokenExpiry } = generateTemporaryOTPToken();

  user.forgotPasswordToken = hashedOTP;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  const forgotEmail = await sendEmail({
    email,
    subject: "Password reset request",
    htmlContent: forgotPasswordEmailTemplate(user?.name, unHashedOTP),
    textContent: forgotPasswordPlainTextTemplate(user?.email, unHashedOTP),
  });

  if (!forgotEmail.success) {
    throw new ApiError(
      500,
      "Something went wrong while sending verification email."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset mail has been sent on your mail id"
      )
    );
});

// reset password
const resetForgottenPassword = asyncHandler(async (req, res) => {
  const { resetCode, newPassword } = req.body;

  const hashedOTP = crypto.createHash("sha256").update(resetCode).digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedOTP,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "code is invalid or expired");
  }

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgottenPassword,
};
