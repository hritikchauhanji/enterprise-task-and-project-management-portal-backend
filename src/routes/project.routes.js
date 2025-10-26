import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getMyProjects,
  getProject,
  updateProject,
} from "../controllers/project.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../constants.js";
import {
  createProjectValidator,
  deleteProjectValidator,
  getProjectValidator,
  updateProjectValidator,
} from "../validators/project.validator.js";
import { validate } from "../validators/validate.js";
import { uploadProjectFile } from "../middlewares/multer.middleware.js";

const router = Router();

// create project router  by admin
router.post(
  "/",
  verifyJWT,
  verifyPermission([UserRolesEnum.ADMIN]),
  uploadProjectFile.single("projectFile"),
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

//update project by admin
router.patch(
  "/:projectId",
  verifyJWT,
  verifyPermission([UserRolesEnum.ADMIN]),
  uploadProjectFile.single("projectFile"),
  updateProjectValidator(),
  validate,
  updateProject
);

// delete project by admin
router.delete(
  "/:projectId",
  verifyJWT,
  verifyPermission([UserRolesEnum.ADMIN]),
  deleteProjectValidator(),
  validate,
  deleteProject
);

// get project by id
router.get(
  "/:projectId",
  verifyJWT,
  getProjectValidator(),
  validate,
  getProject
);

export default router;
