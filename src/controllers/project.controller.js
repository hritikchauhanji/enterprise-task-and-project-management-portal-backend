import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

// create project by admin
const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline } = req.body;
  let { members } = req.body;

  if (typeof members === "string") {
    members = members.trim();
    if (members.startsWith("[") && members.endsWith("]")) {
      try {
        members = JSON.parse(members);
      } catch {
        throw new ApiError(400, "Invalid members format, must be a JSON array");
      }
    } else {
      members = [members];
    }
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

  const existedProject = await Project.findOne({ name });
  if (existedProject) {
    throw new ApiError(409, "Project with name already exists");
  }

  const [day, month, year] = deadline.split("-");
  const formattedDeadline = new Date(`${year}-${month}-${day}T00:00:00Z`);

  let projectFileUrl = "";
  let projectFilePublicId = "";
  const projectFileLocalPath = req.file?.path;

  if (projectFileLocalPath) {
    const uploadedFile = await uploadOnCloudinary(projectFileLocalPath);
    if (!uploadedFile.url) {
      throw new ApiError(400, "Error when project file upload on cloudinary!");
    } else {
      projectFileUrl = uploadedFile.url;
      projectFilePublicId = uploadedFile.public_id;
    }
  }

  const createdProject = await Project.create({
    name: name.trim(),
    description,
    deadline: formattedDeadline,
    members,
    file: {
      public_id: projectFilePublicId,
      url: projectFileUrl,
    },
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
  const { name, description, deadline } = req.body;
  let { members } = req.body;

  if (typeof members === "string") {
    members = members.trim();
    if (members.startsWith("[") && members.endsWith("]")) {
      try {
        members = JSON.parse(members);
      } catch {
        throw new ApiError(400, "Invalid members format, must be a JSON array");
      }
    } else {
      members = [members];
    }
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(400, "Project not found");
  }

  if (project.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this project");
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

  let projectFileUrl = project.file?.url || "";
  let projectFilePublicId = project.file?.public_id || "";

  const projectFileLocalPath = req.file?.path;

  if (projectFileLocalPath) {
    if (projectFilePublicId) {
      const deleteOldFile = await deleteFromCloudinary(projectFilePublicId);
      if (!deleteOldFile || deleteOldFile.result === "not found") {
        throw new ApiError(
          500,
          "Error deleting old project file from Cloudinary"
        );
      }
    }

    const uploadedFile = await uploadOnCloudinary(projectFileLocalPath);
    if (!uploadedFile?.url) {
      throw new ApiError(400, "Error uploading new project file to Cloudinary");
    }

    projectFileUrl = uploadedFile.url;
    projectFilePublicId = uploadedFile.public_id;
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $set: {
        name: name.trim(),
        description,
        deadline: formattedDeadline,
        members,
        file: {
          public_id: projectFilePublicId,
          url: projectFileUrl,
        },
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
