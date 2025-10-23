import express from "express";
import userRoutes from "./routes/user.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//routes
app.use("/api/v1/auth", userRoutes);
app.use(errorHandler);

export { app };
