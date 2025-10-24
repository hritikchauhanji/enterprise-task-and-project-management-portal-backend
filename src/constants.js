export const DB_NAME = "task_and_project_managetment_db";

export const UserRolesEnum = {
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const USER_COOKIE_EXPIRY = 3 * 24 * 60 * 60 * 1000; // 3 days

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes

export const TaskPriorityEnum = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const TaskStatusEnum = {
  TODO: "To-Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export const AvailableTaskPriorities = Object.values(TaskPriorityEnum);
export const AvailableTaskStatuses = Object.values(TaskStatusEnum);
