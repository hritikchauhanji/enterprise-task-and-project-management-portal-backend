import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changePasswordValidator,
  updateAccountValidator,
} from "../utils/validators/user.validator.js";
import { validate } from "../utils/validators/validate.js";

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
router.post(
  "/update-account",
  verifyJWT,
  updateAccountValidator(),
  validate,
  updateAccountDetails
);

export default router;
