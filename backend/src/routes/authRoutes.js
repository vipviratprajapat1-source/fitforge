import { Router } from "express";
import { body } from "express-validator";
import { login, me, signup } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post(
  "/signup",
  [
    body("name").isLength({ min: 2, max: 60 }),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("profile.fitnessLevel").optional().isIn(["Beginner", "Intermediate", "Pro", "Max"]),
  ],
  signup
);

router.post("/login", [body("email").isEmail(), body("password").isLength({ min: 8 })], login);
router.get("/me", requireAuth, me);

export default router;

