import { Router } from "express";
import { createProject } from "../controllers/project.controller";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware";
import { UserRolesEnum } from "../constants";

const router = Router();

// create project router omly by admin
router.post(
  "/",
  verifyJWT,
  verifyPermission([UserRolesEnum.ADMIN]),
  createProject
);
