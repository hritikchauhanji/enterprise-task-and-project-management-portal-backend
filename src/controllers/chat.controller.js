import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.model.js";

// get messages for a project
const getProjectMessages = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const messages = await Chat.find({ projectId }).sort({ createdAt: 1 });

  return res.status(200).json(200, messages, "Message fetched Successfully");
});

export { getProjectMessages };
