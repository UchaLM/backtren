import express from "express";
import cors from "cors";
import morgan from "morgan";
import healthRouter from "./router/health.route.js";
import userRouter from "./router/user.route.js";
import subjectRouter from "./router/subject.route.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/health", healthRouter);
app.use("/users", userRouter);
app.use("/subjects", subjectRouter);

export default app;