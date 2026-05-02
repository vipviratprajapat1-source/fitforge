import {
  createBootstrapPayload,
  getDailyChallenge,
  getMotivationalQuote,
  getRecommendedWorkouts,
  summarizeStats,
} from "@shared/fitnessData.js";
import { getTodayKey } from "./formatters";

export const bootstrapFallback = createBootstrapPayload();

const randomId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.round(Math.random() * 1000)}`;

export const buildGuestUser = (seed = {}) => {
  const profile = {
    ageGroup: seed.profile?.ageGroup || "Above 18",
    gender: seed.profile?.gender || "Prefer not to say",
    fitnessLevel: seed.profile?.fitnessLevel || "Beginner",
    goals: seed.profile?.goals || ["Full body"],
    injuries: seed.profile?.injuries || [],
  };

  const base = {
    id: "guest-athlete",
    name: seed.name || "Guest Athlete",
    username: "guest-athlete",
    email: "",
    profile,
    settings: {
      theme: seed.settings?.theme || "dark",
      dailyReminderTime: seed.settings?.dailyReminderTime || "07:00",
      notificationsEnabled: seed.settings?.notificationsEnabled || false,
      smartReminders: seed.settings?.smartReminders ?? true,
      voiceGuidance: seed.settings?.voiceGuidance ?? true,
    },
    customWorkouts: seed.customWorkouts || [],
    history: seed.history || [],
    bodyProgress: seed.bodyProgress || [],
    goalTrackers: seed.goalTrackers || [],
    friends: seed.friends || [],
    challenges: seed.challenges || [],
    dailyChallenge: getDailyChallenge(),
  };

  const stats = summarizeStats(base.history, base.customWorkouts, base.friends, base.goalTrackers);
  return {
    ...base,
    stats: {
      ...stats,
      longestStreak: Math.max(seed.stats?.longestStreak || 0, stats.streak),
    },
  };
};

export const rebuildGuestUser = (draft) => buildGuestUser(draft);

export const getWorkoutById = (catalog, customWorkouts, workoutId) =>
  [...catalog, ...(customWorkouts || [])].find((workout) => workout.id === workoutId);

export const buildGuestCompletion = ({ user, workout }) => ({
  workoutId: workout.id,
  title: workout.title,
  duration: workout.duration,
  caloriesBurned: workout.caloriesBurned || Math.round(workout.duration * 4.2),
  xpEarned: 100 + workout.duration * 2,
  goal: workout.goals?.[0] || "Full body",
  source: user.customWorkouts?.some((item) => item.id === workout.id) ? "custom" : "catalog",
  completedAt: new Date().toISOString(),
});

export const incrementGoalTrackers = (goalTrackers, completion) =>
  (goalTrackers || []).map((tracker) => {
    const next = { ...tracker };
    if (next.status === "completed") {
      return next;
    }
    if (next.metric === "days" || next.metric === "workouts") {
      next.current += 1;
    }
    if (next.metric === "calories") {
      next.current += completion.caloriesBurned;
    }
    if (next.current >= next.target) {
      next.status = "completed";
    }
    return next;
  });

export const createCustomWorkoutDraft = (workout = {}) => ({
  id: workout.id || randomId(),
  title: workout.title || "",
  description: workout.description || "",
  duration: workout.duration || 20,
  difficulty: workout.difficulty || "Custom",
  restSeconds: workout.restSeconds || 20,
  targetMuscles: workout.targetMuscles || [],
  exercises: workout.exercises || [],
});

export const createGoalTrackerDraft = ({ title, target, metric = "days" }) => ({
  id: randomId(),
  title,
  target,
  metric,
  current: 0,
  status: "active",
  deadline: new Date(Date.now() + target * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
});

export const buildLeaderboards = (sampleUsers, guestUser) => {
  const everyone = guestUser ? [...sampleUsers, guestUser] : sampleUsers;
  return everyone.reduce((accumulator, user) => {
    const level = user.profile?.fitnessLevel || "Beginner";
    const entry = {
      id: user.id || user.username,
      name: user.name,
      username: user.username,
      streak: user.stats?.streak || 0,
      totalWorkouts: user.stats?.totalWorkouts || 0,
      level: user.stats?.level || 1,
      xp: user.stats?.xp || 0,
      fitnessLevel: level,
    };
    accumulator[level] = accumulator[level] || [];
    accumulator[level].push(entry);
    return accumulator;
  }, {});
};

export const normalizeLeaderboards = (leaderboards) => {
  const normalized = {};
  Object.entries(leaderboards || {}).forEach(([level, entries]) => {
    normalized[level] = [...entries]
      .sort((a, b) => b.streak - a.streak || b.totalWorkouts - a.totalWorkouts || b.xp - a.xp)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
  });
  return normalized;
};

export const getFriendSummaries = (sampleUsers, user) =>
  sampleUsers.filter((sample) => (user.friends || []).includes(sample.username));

export const getChallengeSummaries = (sampleUsers, user) =>
  (user.challenges || []).map((challenge) => {
    const friend = sampleUsers.find((sample) => sample.username === challenge.friendId);
    const metricKey = challenge.metric === "streak" ? "streak" : "totalWorkouts";
    return {
      ...challenge,
      friendName: friend?.name || "Friend",
      friendUsername: friend?.username || "",
      friendMetricValue: friend?.stats?.[metricKey] || 0,
      yourMetricValue: user.stats?.[metricKey] || 0,
    };
  });

export const buildCalendarMap = (history) =>
  (history || []).reduce((accumulator, entry) => {
    const key = String(entry.completedAt).slice(0, 10);
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

export const getDashboardPayload = ({ user, workouts }) => {
  const quote = getMotivationalQuote();
  const recommendations = getRecommendedWorkouts({
    profile: user.profile,
    workouts,
    availableMinutes: 25,
    recentWorkoutIds: (user.history || []).slice(0, 5).map((entry) => entry.workoutId),
  });

  return {
    quote,
    dailyChallenge: getDailyChallenge(),
    recommendations,
    quickStart: recommendations[0] || workouts[0],
    todayCompleted: (user.history || []).some((entry) => String(entry.completedAt).slice(0, 10) === getTodayKey()),
  };
};

