import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// create project by admin
const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline, members } = req.body;

  if (
    !name?.trim() ||
    !description?.trim() ||
    !deadline?.trim() ||
    !members ||
    !Array.isArray(members) ||
    members.length === 0
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedProject = await Project.findOne({ name });
  if (existedProject) {
    throw new ApiError(409, "Project with name already exists");
  }

  const [day, month, year] = deadline.split("-");
  const formattedDeadline = new Date(`${year}-${month}-${day}T00:00:00Z`);

  const createdProject = await Project.create({
    name: name.trim(),
    description,
    deadline: formattedDeadline,
    members,
    createdBy: req.user._id,
  });

  if (!createdProject) {
    throw new ApiError(500, "Something went wrong while creating the project");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdProject, "Project Created Successfully"));
});

// get projects by admin
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });

  if (!projects) {
    throw new ApiError(404, "No Project found for this admin");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

// get projects by employee which assign by admin
const getMyProjects = async (req, res) => {
  const projects = await Project.find({ members: req.user._id }).sort({
    createdAt: -1,
  });

  if (!projects) {
    throw new ApiError(404, "No Project found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
};

// update project by admin
const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, deadline, members } = req.body;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(400, "Project not found");
  }

  if (
    !name?.trim() ||
    !description?.trim() ||
    !deadline?.trim() ||
    !members ||
    !Array.isArray(members) ||
    members.length === 0
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const [day, month, year] = deadline.split("-");
  const formattedDeadline = new Date(`${year}-${month}-${day}T00:00:00Z`);

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $set: {
        name: name.trim(),
        description,
        deadline: formattedDeadline,
        members,
      },
    },
    { new: true }
  );

  if (!updatedProject) {
    throw new ApiError(500, "Error while updating the project.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, "Project Updated Successfully"));
});

// Delete project by admin (only if createdBy matches admin)
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this project");
  }

  await Project.findByIdAndDelete(projectId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        `Project "${project.name}" has been deleted successfully`
      )
    );
});

export {
  createProject,
  getAllProjects,
  getMyProjects,
  updateProject,
  deleteProject,
};
