import { Router } from "express";
import {
  changeCurrentPassword,
  deleteUser,
  getCurrentUser,
  updateAccountDetails,
  updateProfileImage,
} from "../controllers/user.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";
import {
  changePasswordValidator,
  deleteUserValidator,
  updateAccountValidator,
} from "../validators/user.validator.js";
import { validate } from "../validators/validate.js";
import { upload } from "../middlewares/multer.middleware.js";
import { UserRolesEnum } from "../constants.js";

const router = Router();

// change password router
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

// delete user by admin router
router.delete(
  "/:userId",
  verifyJWT,
  verifyPermission([UserRolesEnum.ADMIN]),
  deleteUserValidator(),
  validate,
  deleteUser
);

export default router;
