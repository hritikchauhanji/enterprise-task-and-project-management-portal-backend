import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AvailableTaskPriorities } from "../constants.js";

// create task in assgned project by Empoyee
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, deadline, projectId } =
    req.body;

  if (!title || !projectId) {
    throw new ApiError(400, "Title and projectId are required.");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const isMember = project.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this project.");
  }

  const [day, month, year] = deadline.split("-");
  const formattedDeadline = new Date(`${year}-${month}-${day}T00:00:00Z`);

  const newTask = await Task.create({
    title,
    description,
    assignee: req.user._id,
    priority,
    status,
    deadline: formattedDeadline,
    projectId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newTask, "Task created successfully."));
});

export { createTask };
