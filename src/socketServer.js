import { Server } from "socket.io";
import { verifyJWTSocket } from "./middlewares/authSocket.js";
import { Chat } from "./models/chat.model.js";

const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => verifyJWTSocket(socket, next));

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name}`);

    socket.on("joinProject", async (projectId) => {
      if (!projectId) return;
      socket.join(projectId);

      const lastMessages = await Chat.find({ projectId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      socket.emit("projectChatHistory", lastMessages.reverse());
    });

    socket.on("sendMessage", async ({ projectId, message }) => {
      if (!projectId || !message) return;

      const chatMessage = {
        projectId,
        senderId: socket.user._id,
        senderName: socket.user.name,
        message,
      };

      const savedMessage = await Chat.create(chatMessage);
      io.to(projectId).emit("receiveMessage", savedMessage);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });

  return io;
};

export { initSocketServer };
