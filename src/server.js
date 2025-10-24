import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import { initSocketServer } from "./socketServer.js";

dotenv.config();

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });

    initSocketServer(server);
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
