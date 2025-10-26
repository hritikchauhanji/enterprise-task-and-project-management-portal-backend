import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// create task in assigned project by Empoyee
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

// get tasks by assigned project
const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required.");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const isMember =
    project.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    ) || project.createdBy.toString() === req.user._id.toString();

  if (!isMember) {
    throw new ApiError(
      403,
      "You are not authorized to view tasks for this project."
    );
  }

  const tasks = await Task.find({ projectId })
    .populate("assignee", "email")
    .sort({ createdAt: -1 });

  if (!tasks) {
    throw new ApiError(404, "Tasks not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully."));
});

// update task by Id
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, priority, status, deadline } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await Project.findById(task.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const isAllowed =
    task.assignee.toString() === req.user._id.toString() ||
    project.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

  if (!isAllowed) {
    throw new ApiError(403, "You are not authorized to update this task.");
  }

  const [day, month, year] = deadline.split("-");
  const formattedDeadline = new Date(`${year}-${month}-${day}T00:00:00Z`);

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        title: title.trim(),
        description,
        deadline: formattedDeadline,
        priority,
        status,
      },
    },
    { new: true }
  );

  if (!updatedTask) {
    throw new ApiError(500, "Error while updating the task.");
  }

  const currectStatusTask = await Task.findById(taskId);
  if (!currectStatusTask) {
    throw new ApiError(404, "Updated Task not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, currectStatusTask, "Task updated successfully.")
    );
});

// delete task by Id
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await Project.findById(task.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const isAllowed =
    task.assignee.toString() === req.user._id.toString() ||
    project.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

  if (!isAllowed) {
    throw new ApiError(403, "You are not authorized to delete this task.");
  }

  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully."));
});

// get all tasks by admin
const getAllTasksByAdmin = asyncHandler(async (_, res) => {
  const tasks = await Task.find()
    .populate("assignee", "name email username")
    .populate("projectId", "name description")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "All tasks fetched successfully."));
});

// get all tasks assigned to the logged-in user
const getTasksByUser = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ assignee: req.user._id }).sort({
    createdAt: -1,
  });
  console.log(tasks);

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully."));
});

export {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getAllTasksByAdmin,
  getTasksByUser,
};
