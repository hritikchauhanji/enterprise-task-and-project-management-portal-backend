import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getMyProjects,
} from "../controllers/project.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../constants.js";
import { createProjectValidator } from "../validators/project.validator.js";
import { validate } from "../validators/validate.js";

const router = Router();

// create project router  by admin
router.post(
  "/",
  verifyJWT,
  verifyPermission([UserRolesEnum.ADMIN]),
  createProjectValidator(),
  validate,
  createProject
);

// get all projects router by admin
router.get(
  "/",
  verifyJWT,
  verifyPermission([UserRolesEnum.ADMIN]),
  getAllProjects
);

// get all project router by employee which assign by admin
router.get(
  "/user",
  verifyJWT,
  verifyPermission([UserRolesEnum.EMPLOYEE]),
  getMyProjects
);

export default router;
