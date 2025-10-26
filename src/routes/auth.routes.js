import { Router } from "express";
import {
  forgotPasswordRequest,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetForgottenPassword,
} from "../controllers/auth.controller.js";
import {
  userForgotPasswordValidator,
  userRegisterValidator,
  userResetForgottenPasswordValidator,
} from "../validators/auth.validator.js";
import { validate } from "../validators/validate.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// register router
router.post(
  "/register",
  upload.single("profileImage"),
  userRegisterValidator(),
  validate,
  registerUser
);

// login router
router.post("/login", loginUser);

// logout router
router.post("/logout", verifyJWT, logoutUser);

// refresh token router
router.post("/refresh-token", refreshAccessToken);

// forgot password router
router.post(
  "/forgot-password",
  userForgotPasswordValidator(),
  validate,
  forgotPasswordRequest
);

// reset password router
router
  .route("/reset-password")
  .post(
    userResetForgottenPasswordValidator(),
    validate,
    resetForgottenPassword
  );

export default router;
