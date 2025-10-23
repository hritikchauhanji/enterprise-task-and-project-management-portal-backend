import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateProfileImage,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changePasswordValidator,
  updateAccountValidator,
} from "../utils/validators/user.validator.js";
import { validate } from "../utils/validators/validate.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// reset password router
router.post(
  "/change-password",
  verifyJWT,
  changePasswordValidator(),
  validate,
  changeCurrentPassword
);

// get current user router
router.get("/current-user", verifyJWT, getCurrentUser);

// update account details router
router.patch(
  "/update-account",
  verifyJWT,
  updateAccountValidator(),
  validate,
  updateAccountDetails
);

// update profileImage router
router.patch(
  "/update-profile-image",
  verifyJWT,
  upload.single("profileImage"),
  updateProfileImage
);

export default router;
