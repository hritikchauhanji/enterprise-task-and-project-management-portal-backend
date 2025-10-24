import { body } from "express-validator";

export const createProjectValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Project name is required")
      .isLength({ min: 6, max: 100 })
      .withMessage("Project name must be between 6 and 100 characters")
      .escape(),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Project description is required")
      .isLength({ min: 100, max: 5000 })
      .withMessage("Description must be between 100 and 5000 characters")
      .escape(),

    body("deadline")
      .trim()
      .notEmpty()
      .withMessage("Deadline is required")
      .matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)
      .withMessage("Deadline must be in format dd-mm-yyyy (e.g., 30-10-2025)"),

    body("members")
      .isArray({ min: 1 })
      .withMessage("Members must be an array with at least one member")
      .custom((arr) =>
        arr.every((m) => typeof m === "string" && m.trim() !== "")
      )
      .withMessage("Each member must be a non-empty string"),
  ];
};

export const updateProjectValidator = () => {
  return [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Project name cannot be empty")
      .isLength({ min: 6, max: 100 })
      .withMessage("Project name must be between 6 and 100 characters")
      .escape(),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Project description cannot be empty")
      .isLength({ min: 100, max: 5000 })
      .withMessage("Description must be between 100 and 5000 characters")
      .escape(),

    body("deadline")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Deadline cannot be empty")
      .matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)
      .withMessage("Deadline must be in format dd-mm-yyyy (e.g., 30-10-2025)"),

    body("members")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Members must be an array with at least one member")
      .custom((arr) =>
        arr.every((m) => typeof m === "string" && m.trim() !== "")
      )
      .withMessage("Each member must be a non-empty string"),
  ];
};
