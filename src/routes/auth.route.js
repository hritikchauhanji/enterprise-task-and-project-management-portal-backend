import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../utils/validators/auth.validator.js";
import { validate } from "../utils/validators/validate.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// register router
router.post("/register", userRegisterValidator(), validate, registerUser);

// login router
router.post("/login", userLoginValidator(), validate, loginUser);

// logout router
router.post("/logout", verifyJWT, logoutUser);

// refresh token router
router.post("/refresh-token", refreshAccessToken);

export default router;
