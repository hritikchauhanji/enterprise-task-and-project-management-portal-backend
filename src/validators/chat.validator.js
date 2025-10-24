import { param } from "express-validator";

const getProjectMessagesValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("Invalid projectId format"),
  ];
};

export { getProjectMessagesValidator };
