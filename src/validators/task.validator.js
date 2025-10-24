import { body } from "express-validator";
import {
  AvailableTaskPriorities,
  AvailableTaskStatuses,
} from "../constants.js";

const createTaskValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Task title is required.")
      .isLength({ min: 6, max: 100 })
      .withMessage("Task title must be between 3 and 100 characters."),

    body("description")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long."),

    body("priority")
      .optional()
      .isIn(AvailableTaskPriorities)
      .withMessage(
        `Invalid priority. Allowed values: ${AvailableTaskPriorities.join(", ")}`
      ),

    body("status")
      .optional()
      .isIn(AvailableTaskStatuses)
      .withMessage(
        `Invalid status. Allowed values: ${AvailableTaskStatuses.join(", ")}`
      ),

    body("deadline")
      .trim()
      .notEmpty()
      .withMessage("Deadline is required")
      .matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)
      .withMessage("Deadline must be in format dd-mm-yyyy (e.g., 30-10-2025)"),

    body("projectId")
      .notEmpty()
      .withMessage("Project ID is required.")
      .isMongoId()
      .withMessage("Invalid project ID format."),
  ];
};

export { createTaskValidator };
