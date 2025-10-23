import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// user change password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// update account
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, username, email } = req.body;

  if (!name || !email || !username) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name,
        username,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// update user profileImage
const updateProfileImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "user does not exists");
  }
  const profileImageLocalPath = req.file?.path;

  if (
    user?.profileImage &&
    user.profileImage.public_id !== "" &&
    user.profileImage.url !== ""
  ) {
    const deleteOldProfileImage = await deleteFromCloudinary(
      user?.profileImage?.public_id
    );

    if (
      !deleteOldProfileImage ||
      deleteOldProfileImage.result === "not found"
    ) {
      throw new ApiError(
        500,
        "Internal server error. When delete the profileImage from the cloudinary"
      );
    }
  }

  let profileImageUrl = "";
  let profileImagePublicId = "";
  if (profileImageLocalPath) {
    const uploadedImage = await uploadOnCloudinary(profileImageLocalPath);
    if (uploadedImage?.url) {
      profileImageUrl = uploadedImage.url;
      profileImagePublicId = uploadedImage.public_id;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profileImage: {
          public_id: profileImagePublicId,
          url: profileImageUrl,
        },
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Avatar image updated successfully")
    );
});

export {
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateProfileImage,
};
