import { body, param } from "express-validator";

const createProjectValidator = () => {
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
      .isLength({ min: 20, max: 500 })
      .withMessage("Description must be between 20 and 500 characters")
      .escape(),

    body("deadline")
      .trim()
      .notEmpty()
      .withMessage("Deadline is required")
      .matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)
      .withMessage("Deadline must be in format dd-mm-yyyy (e.g., 30-10-2025)"),

    body("members").custom((value) => {
      let membersArray;

      if (typeof value === "string") {
        value = value.trim();
        if (value.startsWith("[") && value.endsWith("]")) {
          try {
            membersArray = JSON.parse(value);
          } catch {
            throw new Error("Members must be a valid JSON array");
          }
        } else {
          membersArray = [value];
        }
      } else if (Array.isArray(value)) {
        membersArray = value;
      } else {
        throw new Error("Members must be a string or an array");
      }

      if (membersArray.length === 0) {
        throw new Error("Members must have at least one member");
      }

      if (
        !membersArray.every((m) => typeof m === "string" && m.trim() !== "")
      ) {
        throw new Error("Each member must be a non-empty string");
      }

      return true;
    }),
  ];
};

const updateProjectValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("Invalid projectId format"),

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
      .isLength({ min: 20, max: 500 })
      .withMessage("Description must be between 20 and 500 characters")
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
      .custom((value) => {
        let membersArray;

        if (typeof value === "string") {
          value = value.trim();
          if (value.startsWith("[") && value.endsWith("]")) {
            try {
              membersArray = JSON.parse(value);
            } catch {
              throw new Error("Members must be a valid JSON array");
            }
          } else {
            membersArray = [value];
          }
        } else if (Array.isArray(value)) {
          membersArray = value;
        } else {
          throw new Error("Members must be a string or an array");
        }

        if (membersArray.length === 0) {
          throw new Error("Members must have at least one member");
        }

        if (
          !membersArray.every((m) => typeof m === "string" && m.trim() !== "")
        ) {
          throw new Error("Each member must be a non-empty string");
        }

        return true;
      }),
  ];
};

const deleteProjectValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("Invalid projectId format"),
  ];
};
const getProjectValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("Invalid projectId format"),
  ];
};

export {
  createProjectValidator,
  updateProjectValidator,
  deleteProjectValidator,
  getProjectValidator,
};
