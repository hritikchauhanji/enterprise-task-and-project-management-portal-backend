import { Project } from "../models/project.model";
import { asyncHandler } from "../utils/asyncHandler";

// create project
const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline, members } = req.body;

  if (
    [name, description, deadline, members].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedProject = await Project.findOne({ name });
  if (existedProject) {
    throw new ApiError(409, "Project with name already exists");
  }

  const createdProject = await Project.create({
    name: name.trim(),
    description,
    deadline,
    members,
    createdBy: req.user._id,
  });

  if (!createdProject) {
    throw new ApiError(500, "Something went wrong while creating the project");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createProject, "Project Created Successfully"));
});

export { createProject };
