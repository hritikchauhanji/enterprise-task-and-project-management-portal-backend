import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTask,
  getTasksByProject,
} from "../controllers/task.controller.js";
import {
  createTaskValidator,
  getTasksByProjectvalidator,
} from "../validators/task.validator.js";
import { validate } from "../validators/validate.js";

const router = Router();

// create task router
router.post("/", verifyJWT, createTaskValidator(), validate, createTask);

// get tasks by assigned project router
router.get(
  "/:projectId",
  verifyJWT,
  getTasksByProjectvalidator(),
  validate,
  getTasksByProject
);

export default router;
