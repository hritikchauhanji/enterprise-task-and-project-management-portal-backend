import express from "express";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//routes
app.use("/api/v1/auth", userRoutes);

export { app };
