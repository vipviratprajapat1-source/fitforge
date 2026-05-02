import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import appRoutes from "./routes/appRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: false,
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api", appRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/social", socialRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

