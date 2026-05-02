import mongoose from "mongoose";

const { Schema } = mongoose;

const exerciseSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    exerciseId: { type: String, default: "" },
    muscleGroup: { type: String, default: "" },
    steps: [{ type: String }],
    animation: { type: String, default: "" },
    workSeconds: { type: Number, required: true },
    restSeconds: { type: Number, required: true },
    tips: [{ type: String }],
  },
  { _id: false }
);

const customWorkoutSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    duration: { type: Number, required: true },
    difficulty: { type: String, default: "Custom" },
    restSeconds: { type: Number, default: 20 },
    targetMuscles: [{ type: String }],
    exercises: [exerciseSchema],
  },
  { timestamps: true, _id: false }
);

const historySchema = new Schema(
  {
    workoutId: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    xpEarned: { type: Number, required: true },
    goal: { type: String, default: "Full body" },
    source: { type: String, enum: ["catalog", "custom"], default: "catalog" },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const bodyProgressSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    weight: { type: Number },
    measurements: {
      waist: Number,
      chest: Number,
      hips: Number,
      arms: Number,
      thighs: Number,
    },
  },
  { _id: true }
);

const goalTrackerSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    metric: { type: String, enum: ["days", "workouts", "calories"], default: "days" },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    deadline: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const challengeSchema = new Schema(
  {
    id: { type: String, required: true },
    friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    metric: { type: String, enum: ["streak", "totalWorkouts"], default: "totalWorkouts" },
    target: { type: Number, required: true },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, lowercase: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    profile: {
      ageGroup: { type: String, enum: ["Below 18", "Above 18"], default: "Above 18" },
      gender: { type: String, default: "Prefer not to say" },
      fitnessLevel: { type: String, enum: ["Beginner", "Intermediate", "Pro", "Max"], default: "Beginner" },
      goals: [{ type: String }],
      injuries: [{ type: String }],
    },
    settings: {
      theme: { type: String, enum: ["light", "dark"], default: "dark" },
      dailyReminderTime: { type: String, default: "07:00" },
      notificationsEnabled: { type: Boolean, default: false },
      smartReminders: { type: Boolean, default: true },
      voiceGuidance: { type: Boolean, default: true },
    },
    stats: {
      streak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      totalWorkouts: { type: Number, default: 0 },
      totalCalories: { type: Number, default: 0 },
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
    },
    customWorkouts: [customWorkoutSchema],
    history: [historySchema],
    bodyProgress: [bodyProgressSchema],
    goalTrackers: [goalTrackerSchema],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    challenges: [challengeSchema],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

