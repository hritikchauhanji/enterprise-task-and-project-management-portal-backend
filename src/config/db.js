import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

let isConnected = false;

const connectDB = async () => {
  try {
    if (!isConnected) {
      const connectionInstance = await mongoose.connect(
        `${process.env.MONGODB_URL}/${DB_NAME}`
      );
      isConnected = true;
      console.log(
        "MongoDB connected successfully: ",
        connectionInstance.connection.host
      );
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export { connectDB };
