export const DB_NAME = "task_and_project_managetment_db";

export const UserRolesEnum = {
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const USER_COOKIE_EXPIRY = 3 * 24 * 60 * 60 * 1000; // 3 days

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes
