import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/apiError.js";
import { UserRolesEnum } from "../constants.js";

// get messages for a project
const getProjectMessages = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(400, "Project not found");
  }

  const canAccessProject = (project, user) => {
    const isAdmin = user.role === UserRolesEnum.ADMIN;
    const isCreator = project.createdBy.toString() === user._id.toString();
    const isMember = project.members.some(
      (memberId) => memberId.toString() === user._id.toString()
    );

    return isAdmin || isCreator || isMember;
  };

  if (!canAccessProject(project, req.user)) {
    throw new ApiError(403, "You are not authorized to access this project");
  }
  const messages = await Chat.find({ projectId }).sort({ createdAt: 1 });

  res.status(200).json({ success: true, messages });
});

export { getProjectMessages };
