import { body } from "express-validator";

const userRegisterValidator = () => {
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
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "Password must be 8+ chars, with upper, lower, number & special char"
      ),
  ];
};

const userLoginValidator = () => {
  return [
    body("identifier")
      .trim()
      .notEmpty()
      .withMessage("Email or Username is required")
      .isLength({ min: 4, max: 100 })
      .withMessage("Identifier must be between 4 and 100 characters"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email format: abcd@example.com")
      .normalizeEmail(),
  ];
};

const userResetForgottenPasswordValidator = () => {
  return [
    body("resetCode")
      .trim()
      .notEmpty()
      .withMessage("verification code is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("Verification code must be exactly 6 characters long")
      .isNumeric()
      .withMessage("reset code must be a 6 digit number"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "Password must be 8+ chars, with upper, lower, number & special char"
      ),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  userResetForgottenPasswordValidator,
};
