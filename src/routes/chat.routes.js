import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getProjectMessages } from "../controllers/chat.controller.js";
import { getProjectMessagesValidator } from "../validators/chat.validator.js";
import { validate } from "../validators/validate";

const router = Router();

router.get(
  "/:projectId",
  verifyJWT,
  getProjectMessagesValidator(),
  validate,
  getProjectMessages
);

export default router;
