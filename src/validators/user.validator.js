import { body } from "express-validator";

const changePasswordValidator = () => {
  return [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old Password is required")
      .isLength({ min: 6 })
      .withMessage("Old Password must be at least 6 characters"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "New Password must be 8+ chars, with upper, lower, number & special char"
      ),
  ];
};

const updateAccountValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 6, max: 50 })
      .withMessage("Name must be between 6 and 50 characters")
      .escape(),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 6, max: 50 })
      .withMessage("Username must be between 6 and 50 characters")
      .escape(),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email format: abcd@example.com")
      .normalizeEmail(),
  ];
};

export { changePasswordValidator, updateAccountValidator };
