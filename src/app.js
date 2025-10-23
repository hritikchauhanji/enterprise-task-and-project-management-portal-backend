import express from "express";
import userRoutes from "./routes/user.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
app.use("/api/v1/auth", userRoutes);
app.use(errorHandler);

export { app };
