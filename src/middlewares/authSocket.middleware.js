import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWTSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token?.split(" ")[1];
    if (!token) throw new Error("Unauthorized");

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new Error("Unauthorized");

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};
