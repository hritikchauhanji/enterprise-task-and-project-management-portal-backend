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

export { userRegisterValidator };
