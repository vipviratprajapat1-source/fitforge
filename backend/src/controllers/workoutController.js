import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  buildRecommendations,
  buildWorkoutCompletion,
  createUserPayload,
  syncUserStats,
  updateGoalTrackersForCompletion,
} from "../services/userService.js";

const throwValidationError = (req) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error("Validation failed.");
    error.status = 422;
    error.errors = result.array();
    throw error;
  }
};

export const getRecommendations = asyncHandler(async (req, res) => {
  const minutes = Number(req.query.minutes || 20);
  const recommendations = buildRecommendations(req.user, minutes);
  res.json({
    recommendations,
    quickStart: recommendations[0] || null,
  });
});

export const completeWorkout = asyncHandler(async (req, res) => {
  throwValidationError(req);

  const payload = buildWorkoutCompletion({
    user: req.user,
    workoutId: req.body.workoutId,
    override: req.body,
  });

  if (!payload) {
    return res.status(404).json({ message: "Workout not found." });
  }

  req.user.history.push(payload);
  updateGoalTrackersForCompletion(req.user, payload);
  syncUserStats(req.user);
  await req.user.save();

  res.status(201).json({
    user: createUserPayload(req.user),
    completion: payload,
  });
});

