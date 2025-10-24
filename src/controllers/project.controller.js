import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// create project
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

export { createProject };
