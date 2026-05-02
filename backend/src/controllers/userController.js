import { randomUUID } from "crypto";
import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  buildProgressPayload,
  createDefaultGoalTracker,
  createUserPayload,
  syncUserStats,
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

export const getProfile = asyncHandler(async (req, res) => {
  syncUserStats(req.user);
  await req.user.save();
  res.json({ user: createUserPayload(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  throwValidationError(req);

  const { name, profile, settings } = req.body;

  if (name) {
    req.user.name = name;
  }

  if (profile) {
    req.user.profile = {
      ...req.user.profile,
      ...profile,
      goals: profile.goals || req.user.profile.goals,
      injuries: profile.injuries || req.user.profile.injuries,
    };
  }

  if (settings) {
    req.user.settings = {
      ...req.user.settings,
      ...settings,
    };
  }

  syncUserStats(req.user);
  await req.user.save();

  res.json({ user: createUserPayload(req.user) });
});

export const getProgress = asyncHandler(async (req, res) => {
  syncUserStats(req.user);
  await req.user.save();
  res.json(buildProgressPayload(req.user));
});

export const addBodyProgress = asyncHandler(async (req, res) => {
  throwValidationError(req);

  req.user.bodyProgress.push({
    date: req.body.date || new Date(),
    weight: req.body.weight,
    measurements: req.body.measurements || {},
  });

  await req.user.save();
  res.status(201).json({ bodyProgress: req.user.bodyProgress });
});

export const createCustomWorkout = asyncHandler(async (req, res) => {
  throwValidationError(req);

  req.user.customWorkouts.push({
    id: randomUUID(),
    title: req.body.title,
    description: req.body.description || "",
    duration: req.body.duration,
    difficulty: req.body.difficulty || "Custom",
    restSeconds: req.body.restSeconds || 20,
    targetMuscles: req.body.targetMuscles || [],
    exercises: req.body.exercises || [],
  });

  syncUserStats(req.user);
  await req.user.save();

  res.status(201).json({
    customWorkouts: req.user.customWorkouts,
    stats: req.user.stats,
  });
});

export const updateCustomWorkout = asyncHandler(async (req, res) => {
  throwValidationError(req);

  const workout = req.user.customWorkouts.find((item) => item.id === req.params.workoutId);
  if (!workout) {
    return res.status(404).json({ message: "Custom workout not found." });
  }

  workout.title = req.body.title || workout.title;
  workout.description = req.body.description ?? workout.description;
  workout.duration = req.body.duration || workout.duration;
  workout.difficulty = req.body.difficulty || workout.difficulty;
  workout.restSeconds = req.body.restSeconds || workout.restSeconds;
  workout.targetMuscles = req.body.targetMuscles || workout.targetMuscles;
  workout.exercises = req.body.exercises || workout.exercises;

  await req.user.save();
  res.json({ customWorkouts: req.user.customWorkouts });
});

export const deleteCustomWorkout = asyncHandler(async (req, res) => {
  req.user.customWorkouts = req.user.customWorkouts.filter((item) => item.id !== req.params.workoutId);
  syncUserStats(req.user);
  await req.user.save();
  res.json({ customWorkouts: req.user.customWorkouts, stats: req.user.stats });
});

export const createGoalTracker = asyncHandler(async (req, res) => {
  throwValidationError(req);

  const tracker = createDefaultGoalTracker(req.body.title, req.body.target);
  tracker.metric = req.body.metric || tracker.metric;
  req.user.goalTrackers.push(tracker);

  syncUserStats(req.user);
  await req.user.save();
  res.status(201).json({ goalTrackers: req.user.goalTrackers, stats: req.user.stats });
});

export const deleteGoalTracker = asyncHandler(async (req, res) => {
  req.user.goalTrackers = req.user.goalTrackers.filter((tracker) => tracker.id !== req.params.goalId);
  syncUserStats(req.user);
  await req.user.save();
  res.json({ goalTrackers: req.user.goalTrackers, stats: req.user.stats });
});

export const updateReminderSettings = asyncHandler(async (req, res) => {
  req.user.settings = {
    ...req.user.settings,
    ...req.body,
  };
  await req.user.save();
  res.json({ settings: req.user.settings });
});

