import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { userRegisterValidator } from "../utils/validators/user.validator.js";
import { validate } from "../utils/validators/validate.js";

const router = Router();

router.post("/register", userRegisterValidator(), validate, registerUser);

router.post("/login", loginUser);

export default router;
