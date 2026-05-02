import { randomUUID } from "crypto";
import {
  calculateAchievements,
  createWorkoutCatalog,
  getDailyChallenge,
  getRecommendedWorkouts,
  summarizeStats,
} from "../../../shared/fitnessData.js";

const workoutCatalog = createWorkoutCatalog();

export const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const createUserPayload = (user) => {
  const baseStats = summarizeStats(
    user.history || [],
    user.customWorkouts || [],
    user.friends || [],
    user.goalTrackers || []
  );

  const longestStreak = Math.max(user.stats?.longestStreak || 0, baseStats.streak);
  const stats = {
    ...baseStats,
    longestStreak,
    achievements: calculateAchievements({
      streak: baseStats.streak,
      totalWorkouts: baseStats.totalWorkouts,
      totalCalories: baseStats.totalCalories,
      customWorkouts: user.customWorkouts?.length || 0,
      friends: user.friends?.length || 0,
      goals: user.goalTrackers?.length || 0,
      userLevel: baseStats.level,
    }),
  };

  return {
    id: String(user._id),
    name: user.name,
    username: user.username,
    email: user.email,
    profile: user.profile,
    settings: user.settings,
    stats,
    customWorkouts: user.customWorkouts,
    history: [...(user.history || [])].sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
    ),
    bodyProgress: [...(user.bodyProgress || [])].sort((a, b) => new Date(a.date) - new Date(b.date)),
    goalTrackers: user.goalTrackers,
    dailyChallenge: getDailyChallenge(),
  };
};

export const syncUserStats = (user) => {
  const summary = summarizeStats(
    user.history || [],
    user.customWorkouts || [],
    user.friends || [],
    user.goalTrackers || []
  );

  user.stats = {
    streak: summary.streak,
    longestStreak: Math.max(user.stats?.longestStreak || 0, summary.streak),
    totalWorkouts: summary.totalWorkouts,
    totalCalories: summary.totalCalories,
    xp: summary.xp,
    level: summary.level,
  };

  return user.stats;
};

export const buildProgressPayload = (user) => {
  const history = [...(user.history || [])].sort(
    (a, b) => new Date(a.completedAt) - new Date(b.completedAt)
  );

  const weeklyMap = new Map();
  const monthlyMap = new Map();

  history.forEach((entry) => {
    const date = new Date(entry.completedAt);
    const dayKey = date.toISOString().slice(0, 10);
    const monthKey = dayKey.slice(0, 7);
    const weekKey = `${monthKey}-W${Math.ceil(date.getDate() / 7)}`;

    weeklyMap.set(weekKey, {
      label: weekKey,
      workouts: (weeklyMap.get(weekKey)?.workouts || 0) + 1,
      calories: (weeklyMap.get(weekKey)?.calories || 0) + entry.caloriesBurned,
    });
    monthlyMap.set(monthKey, {
      label: monthKey,
      workouts: (monthlyMap.get(monthKey)?.workouts || 0) + 1,
      calories: (monthlyMap.get(monthKey)?.calories || 0) + entry.caloriesBurned,
    });
    entry.calendarKey = dayKey;
  });

  return {
    stats: createUserPayload(user).stats,
    weekly: [...weeklyMap.values()].slice(-8),
    monthly: [...monthlyMap.values()].slice(-6),
    history: history.reverse(),
    bodyProgress: user.bodyProgress || [],
    goals: user.goalTrackers || [],
  };
};

export const findWorkoutById = (user, workoutId) => {
  const catalogWorkout = workoutCatalog.find((workout) => workout.id === workoutId);
  if (catalogWorkout) {
    return { workout: catalogWorkout, source: "catalog" };
  }

  const customWorkout = (user.customWorkouts || []).find((item) => item.id === workoutId);
  if (customWorkout) {
    return { workout: customWorkout, source: "custom" };
  }

  return null;
};

export const buildWorkoutCompletion = ({ user, workoutId, override = {} }) => {
  const result = findWorkoutById(user, workoutId);
  if (!result) {
    return null;
  }

  const duration = override.duration || result.workout.duration;
  const caloriesBurned = override.caloriesBurned || result.workout.caloriesBurned || Math.round(duration * 4.5);
  const xpEarned = 100 + duration * 2;

  return {
    workoutId,
    title: override.title || result.workout.title,
    duration,
    caloriesBurned,
    xpEarned,
    goal: override.goal || result.workout.goals?.[0] || "Full body",
    source: result.source,
    completedAt: override.completedAt ? new Date(override.completedAt) : new Date(),
  };
};

export const updateGoalTrackersForCompletion = (user, historyEntry) => {
  (user.goalTrackers || []).forEach((tracker) => {
    if (tracker.status === "completed") {
      return;
    }

    if (tracker.metric === "days") {
      tracker.current += 1;
    }
    if (tracker.metric === "workouts") {
      tracker.current += 1;
    }
    if (tracker.metric === "calories") {
      tracker.current += historyEntry.caloriesBurned;
    }

    if (tracker.current >= tracker.target) {
      tracker.status = "completed";
    }
  });
};

export const createDefaultGoalTracker = (title, target = 30) => ({
  id: randomUUID(),
  title,
  metric: "days",
  target,
  current: 0,
  status: "active",
  deadline: new Date(Date.now() + target * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
});

export const buildRecommendations = (user, minutes = 20) =>
  getRecommendedWorkouts({
    profile: user.profile,
    availableMinutes: minutes,
    recentWorkoutIds: (user.history || []).slice(0, 5).map((entry) => entry.workoutId),
    workouts: workoutCatalog,
  });

export const safeUserSummary = (user) => ({
  id: String(user._id),
  name: user.name,
  username: user.username,
  profile: user.profile,
  stats: user.stats,
});

