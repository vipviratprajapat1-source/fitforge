import { Router } from "express";
import { body } from "express-validator";
import { completeWorkout, getRecommendations } from "../controllers/workoutController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/recommendations", getRecommendations);
router.post(
  "/complete",
  [body("workoutId").isString().isLength({ min: 3 })],
  completeWorkout
);

export default router;

