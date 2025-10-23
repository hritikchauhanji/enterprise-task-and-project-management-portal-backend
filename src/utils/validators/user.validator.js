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

export { changePasswordValidator };
