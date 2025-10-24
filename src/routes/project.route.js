import { Router } from "express";
import { createProject } from "../controllers/project.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../constants.js";
import { createProjectValidator } from "../validators/project.validator.js";
import { validate } from "../validators/validate.js";

const router = Router();

// create project router omly by admin
router.post(
  "/",
  verifyJWT,
  verifyPermission([UserRolesEnum.ADMIN]),
  createProjectValidator(),
  validate,
  createProject
);

export default router;
