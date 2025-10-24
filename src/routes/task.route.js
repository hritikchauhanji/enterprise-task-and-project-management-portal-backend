import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getTasksByProject,
  updateTask,
} from "../controllers/task.controller.js";
import {
  createTaskValidator,
  deleteTaskValidator,
  getTasksByProjectvalidator,
  updateTaskValidator,
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

// update task by id router
router.patch(
  "/:taskId",
  verifyJWT,
  updateTaskValidator(),
  validate,
  updateTask
);

// delete task by id router
router.delete(
  "/:taskId",
  verifyJWT,
  deleteTaskValidator(),
  validate,
  deleteTask
);

export default router;
