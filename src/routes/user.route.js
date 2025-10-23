import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { changePasswordValidator } from "../utils/validators/user.validator.js";
import { validate } from "../utils/validators/validate.js";

const router = Router();

router.post(
  "/change-password",
  verifyJWT,
  changePasswordValidator(),
  validate,
  changeCurrentPassword
);

router.get("/current-user", verifyJWT, getCurrentUser);

export default router;
