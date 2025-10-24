import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTask } from "../controllers/task.controller.js";
import { createTaskValidator } from "../validators/task.validator.js";
import { validate } from "../validators/validate.js";

const router = Router();

// create task
router.post("/", verifyJWT, createTaskValidator(), validate, createTask);

export default router;
