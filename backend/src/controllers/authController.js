import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";
import { createUserPayload, slugify, syncUserStats } from "../services/userService.js";

const throwValidationError = (req) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error("Validation failed.");
    error.status = 422;
    error.errors = result.array();
    throw error;
  }
};

const deriveUsername = (name, email) => {
  const base = slugify(name || email.split("@")[0] || "athlete").slice(0, 18) || "athlete";
  return `${base}${Math.floor(Math.random() * 1000)}`;
};

export const signup = asyncHandler(async (req, res) => {
  throwValidationError(req);

  const { name, email, password, profile = {}, username } = req.body;
  const normalizedEmail = String(email).toLowerCase();
  const normalizedUsername = String(username || deriveUsername(name, normalizedEmail)).toLowerCase();

  const existing = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (existing) {
    return res.status(409).json({ message: "Email or username already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: normalizedEmail,
    username: normalizedUsername,
    passwordHash,
    profile: {
      ageGroup: profile.ageGroup || "Above 18",
      gender: profile.gender || "Prefer not to say",
      fitnessLevel: profile.fitnessLevel || "Beginner",
      goals: profile.goals || ["Full body"],
      injuries: profile.injuries || [],
    },
  });

  syncUserStats(user);
  await user.save();

  res.status(201).json({
    token: signToken(user._id),
    user: createUserPayload(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  throwValidationError(req);

  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  syncUserStats(user);
  await user.save();

  res.json({
    token: signToken(user._id),
    user: createUserPayload(user),
  });
});

export const me = asyncHandler(async (req, res) => {
  syncUserStats(req.user);
  await req.user.save();
  res.json({ user: createUserPayload(req.user) });
});

