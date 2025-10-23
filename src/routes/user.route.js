import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../utils/validators/user.validator.js";
import { validate } from "../utils/validators/validate.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// register router
router.post("/register", userRegisterValidator(), validate, registerUser);

// login router
router.post("/login", userLoginValidator(), validate, loginUser);

// logout router
router.post("/logout", verifyJWT, logoutUser);

export default router;
