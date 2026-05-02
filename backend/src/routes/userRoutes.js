import { Router } from "express";
import { body } from "express-validator";
import {
  addBodyProgress,
  createCustomWorkout,
  createGoalTracker,
  deleteCustomWorkout,
  deleteGoalTracker,
  getProfile,
  getProgress,
  updateCustomWorkout,
  updateProfile,
  updateReminderSettings,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/profile", getProfile);
router.put(
  "/profile",
  [
    body("name").optional().isLength({ min: 2, max: 60 }),
    body("profile.ageGroup").optional().isIn(["Below 18", "Above 18"]),
    body("profile.fitnessLevel").optional().isIn(["Beginner", "Intermediate", "Pro", "Max"]),
  ],
  updateProfile
);
router.get("/progress", getProgress);
router.post("/body-progress", [body("weight").optional().isNumeric()], addBodyProgress);
router.post(
  "/custom-workouts",
  [
    body("title").isLength({ min: 2, max: 80 }),
    body("duration").isNumeric(),
    body("exercises").isArray({ min: 1 }),
  ],
  createCustomWorkout
);
router.put(
  "/custom-workouts/:workoutId",
  [
    body("title").optional().isLength({ min: 2, max: 80 }),
    body("duration").optional().isNumeric(),
    body("exercises").optional().isArray({ min: 1 }),
  ],
  updateCustomWorkout
);
router.delete("/custom-workouts/:workoutId", deleteCustomWorkout);
router.post(
  "/goals",
  [body("title").isLength({ min: 2, max: 120 }), body("target").optional().isNumeric()],
  createGoalTracker
);
router.delete("/goals/:goalId", deleteGoalTracker);
router.put("/settings/reminders", updateReminderSettings);

export default router;

