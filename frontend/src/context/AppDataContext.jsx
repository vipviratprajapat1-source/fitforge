import { createContext, useContext, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/api/client";
import { usePersistentState } from "@/hooks/usePersistentState";
import { useAuth } from "@/context/AuthContext";
import {
  bootstrapFallback,
  buildCalendarMap,
  buildGuestCompletion,
  buildGuestUser,
  buildLeaderboards,
  createCustomWorkoutDraft,
  createGoalTrackerDraft,
  getChallengeSummaries,
  getDashboardPayload,
  getFriendSummaries,
  getWorkoutById,
  incrementGoalTrackers,
  normalizeLeaderboards,
  rebuildGuestUser,
} from "@/utils/fitnessEngine";
import {
  getNextReminderDelay,
  requestNotificationPermission,
  sendBrowserNotification,
} from "@/utils/notifications";

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const auth = useAuth();
  const [bootstrap, setBootstrap] = useState(bootstrapFallback);
  const [guestUser, setGuestUser] = usePersistentState(
    "fitforge_guest_user",
    buildGuestUser()
  );
  const [leaderboards, setLeaderboards] = useState({});
  const [friends, setFriends] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingBootstrap, setLoadingBootstrap] = useState(true);
  const [busy, setBusy] = useState(false);
  const reminderRef = useRef(null);

  const user = auth.isAuthenticated ? auth.user : guestUser;
  const workouts = bootstrap.workouts || [];
  const mealPlans = bootstrap.mealPlans || [];
  const badges = bootstrap.badges || [];
  const sampleUsers = bootstrap.sampleUsers || [];

  useEffect(() => {
    const loadBootstrap = async () => {
      try {
        const payload = await apiFetch("/bootstrap");
        setBootstrap(payload.data);
      } catch (error) {
        setBootstrap(bootstrapFallback);
      } finally {
        setLoadingBootstrap(false);
      }
    };

    loadBootstrap();
  }, []);

  useEffect(() => {
    if (!user?.settings?.theme) {
      return;
    }
    document.documentElement.classList.toggle("dark", user.settings.theme === "dark");
  }, [user?.settings?.theme]);

  useEffect(() => {
    const refreshSocial = async () => {
      if (!auth.isAuthenticated) {
        setFriends(getFriendSummaries(sampleUsers, guestUser));
        setChallenges(getChallengeSummaries(sampleUsers, guestUser));
        setLeaderboards(normalizeLeaderboards(buildLeaderboards(sampleUsers, guestUser)));
        return;
      }

      try {
        const [friendsPayload, challengesPayload, leaderboardPayload] = await Promise.all([
          apiFetch("/social/friends"),
          apiFetch("/social/challenges"),
          apiFetch("/leaderboard"),
        ]);
        setFriends(friendsPayload.friends);
        setChallenges(challengesPayload.challenges);
        setLeaderboards(leaderboardPayload.leaderboards);
      } catch (error) {
        setLeaderboards(normalizeLeaderboards(buildLeaderboards(sampleUsers, guestUser)));
      }
    };

    refreshSocial();
  }, [auth.isAuthenticated, auth.user, guestUser, sampleUsers]);

  useEffect(() => {
    if (!user?.settings?.notificationsEnabled) {
      if (reminderRef.current) {
        window.clearTimeout(reminderRef.current);
      }
      return;
    }

    const scheduleReminder = () => {
      const delay = getNextReminderDelay(user.settings.dailyReminderTime);
      reminderRef.current = window.setTimeout(() => {
        sendBrowserNotification("Time to train", {
          body: "Your no-equipment workout is ready. Keep the streak alive.",
        });
        scheduleReminder();
      }, delay);
    };

    scheduleReminder();

    return () => {
      if (reminderRef.current) {
        window.clearTimeout(reminderRef.current);
      }
    };
  }, [user?.settings?.notificationsEnabled, user?.settings?.dailyReminderTime]);

  useEffect(() => {
    if (!user?.settings?.smartReminders || !user?.settings?.notificationsEnabled) {
      return;
    }

    const lastWorkout = user.history?.[0];
    if (!lastWorkout) {
      return;
    }

    const hoursSinceLastWorkout =
      (Date.now() - new Date(lastWorkout.completedAt).getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastWorkout >= 36) {
      sendBrowserNotification("Momentum check", {
        body: "You have been away for a bit. A 15-minute session can restart the streak.",
      });
    }
  }, [user?.history, user?.settings?.smartReminders, user?.settings?.notificationsEnabled]);

  const syncGuest = (updater) => {
    setGuestUser((current) => rebuildGuestUser(updater(current)));
  };

  const refreshLeaderboards = async () => {
    try {
      const payload = await apiFetch("/leaderboard");
      setLeaderboards(payload.leaderboards);
    } catch (error) {
      setLeaderboards(normalizeLeaderboards(buildLeaderboards(sampleUsers, guestUser)));
    }
  };

  const updateProfile = async (payload) => {
    setBusy(true);
    try {
      if (!auth.isAuthenticated) {
        syncGuest((current) => ({
          ...current,
          ...(payload.name ? { name: payload.name } : {}),
          profile: {
            ...current.profile,
            ...(payload.profile || {}),
          },
          settings: {
            ...current.settings,
            ...(payload.settings || {}),
          },
        }));
        return;
      }

      const response = await apiFetch("/user/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      auth.updateAuthenticatedUser(response.user);
    } finally {
      setBusy(false);
    }
  };

  const requestReminderPermission = async () => {
    const permission = await requestNotificationPermission();
    if (permission === "granted") {
      updateProfile({
        settings: {
          notificationsEnabled: true,
        },
      });
    }
    return permission;
  };

  const saveCustomWorkout = async (workout) => {
    const draft = createCustomWorkoutDraft(workout);
    setBusy(true);
    try {
      if (!auth.isAuthenticated) {
        syncGuest((current) => {
          const exists = current.customWorkouts.find((item) => item.id === draft.id);
          const customWorkouts = exists
            ? current.customWorkouts.map((item) => (item.id === draft.id ? draft : item))
            : [...current.customWorkouts, draft];
          return {
            ...current,
            customWorkouts,
          };
        });
        return draft;
      }

      const endpoint = workout.id ? `/user/custom-workouts/${workout.id}` : "/user/custom-workouts";
      const method = workout.id ? "PUT" : "POST";
      const response = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(draft),
      });
      auth.updateAuthenticatedUser({
        ...auth.user,
        customWorkouts: response.customWorkouts,
        stats: response.stats || auth.user.stats,
      });
      return draft;
    } finally {
      setBusy(false);
    }
  };

  const deleteCustomWorkout = async (workoutId) => {
    setBusy(true);
    try {
      if (!auth.isAuthenticated) {
        syncGuest((current) => ({
          ...current,
          customWorkouts: current.customWorkouts.filter((item) => item.id !== workoutId),
        }));
        return;
      }

      const response = await apiFetch(`/user/custom-workouts/${workoutId}`, {
        method: "DELETE",
      });
      auth.updateAuthenticatedUser({
        ...auth.user,
        customWorkouts: response.customWorkouts,
        stats: response.stats,
      });
    } finally {
      setBusy(false);
    }
  };

  const completeWorkout = async (workoutId) => {
    const workout = getWorkoutById(workouts, user.customWorkouts, workoutId);
    if (!workout) {
      throw new Error("Workout not found.");
    }

    setBusy(true);
    try {
      if (!auth.isAuthenticated) {
        syncGuest((current) => {
          const completion = buildGuestCompletion({ user: current, workout });
          return {
            ...current,
            history: [completion, ...current.history],
            goalTrackers: incrementGoalTrackers(current.goalTrackers, completion),
          };
        });
      } else {
        const response = await apiFetch("/workouts/complete", {
          method: "POST",
          body: JSON.stringify({ workoutId }),
        });
        auth.updateAuthenticatedUser(response.user);
      }

      refreshLeaderboards();
    } finally {
      setBusy(false);
    }
  };

  const addBodyProgress = async (entry) => {
    setBusy(true);
    try {
      if (!auth.isAuthenticated) {
        syncGuest((current) => ({
          ...current,
          bodyProgress: [...current.bodyProgress, entry],
        }));
        return;
      }

      const response = await apiFetch("/user/body-progress", {
        method: "POST",
        body: JSON.stringify(entry),
      });
      auth.updateAuthenticatedUser({
        ...auth.user,
        bodyProgress: response.bodyProgress,
      });
    } finally {
      setBusy(false);
    }
  };

  const addGoalTracker = async (draft) => {
    const tracker = createGoalTrackerDraft(draft);
    setBusy(true);
    try {
      if (!auth.isAuthenticated) {
        syncGuest((current) => ({
          ...current,
          goalTrackers: [...current.goalTrackers, tracker],
        }));
        return;
      }

      const response = await apiFetch("/user/goals", {
        method: "POST",
        body: JSON.stringify(draft),
      });
      auth.updateAuthenticatedUser({
        ...auth.user,
        goalTrackers: response.goalTrackers,
        stats: response.stats,
      });
    } finally {
      setBusy(false);
    }
  };

  const deleteGoalTracker = async (goalId) => {
    setBusy(true);
    try {
      if (!auth.isAuthenticated) {
        syncGuest((current) => ({
          ...current,
          goalTrackers: current.goalTrackers.filter((item) => item.id !== goalId),
        }));
        return;
      }

      const response = await apiFetch(`/user/goals/${goalId}`, {
        method: "DELETE",
      });
      auth.updateAuthenticatedUser({
        ...auth.user,
        goalTrackers: response.goalTrackers,
        stats: response.stats,
      });
    } finally {
      setBusy(false);
    }
  };

  const searchFriends = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    if (!auth.isAuthenticated) {
      const results = sampleUsers.filter((sample) => {
        const haystack = `${sample.name} ${sample.username}`.toLowerCase();
        return haystack.includes(query.toLowerCase()) && !user.friends.includes(sample.username);
      });
      setSearchResults(results);
      return results;
    }

    const payload = await apiFetch(`/social/friends/search?q=${encodeURIComponent(query)}`);
    setSearchResults(payload.users);
    return payload.users;
  };

  const addFriend = async (friendId) => {
    setBusy(true);
    try {
      if (!auth.isAuthenticated) {
        syncGuest((current) => ({
          ...current,
          friends: current.friends.includes(friendId) ? current.friends : [...current.friends, friendId],
        }));
        setSearchResults((current) => current.filter((entry) => entry.username !== friendId));
        return;
      }

      const response = await apiFetch("/social/friends", {
        method: "POST",
        body: JSON.stringify({ friendId }),
      });
      setFriends(response.friends);
      refreshLeaderboards();
    } finally {
      setBusy(false);
    }
  };

  const createChallenge = async (draft) => {
    setBusy(true);
    try {
      if (!auth.isAuthenticated) {
        syncGuest((current) => ({
          ...current,
          challenges: [
            ...current.challenges,
            {
              id: `challenge-${Date.now()}`,
              friendId: draft.friendId,
              title: draft.title,
              metric: draft.metric,
              target: draft.target,
              status: "active",
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        return;
      }

      await apiFetch("/social/challenges", {
        method: "POST",
        body: JSON.stringify(draft),
      });
      const payload = await apiFetch("/social/challenges");
      setChallenges(payload.challenges);
    } finally {
      setBusy(false);
    }
  };

  const dashboard = getDashboardPayload({ user, workouts });
  const customWorkouts = user.customWorkouts || [];
  const combinedWorkouts = [...workouts, ...customWorkouts];
  const calendarMap = buildCalendarMap(user.history || []);

  return (
    <AppDataContext.Provider
      value={{
        loadingBootstrap,
        busy,
        user,
        workouts,
        mealPlans,
        badges,
        leaderboards,
        friends,
        challenges,
        searchResults,
        customWorkouts,
        combinedWorkouts,
        calendarMap,
        dashboard,
        updateProfile,
        saveCustomWorkout,
        deleteCustomWorkout,
        completeWorkout,
        addBodyProgress,
        addGoalTracker,
        deleteGoalTracker,
        searchFriends,
        addFriend,
        createChallenge,
        refreshLeaderboards,
        requestReminderPermission,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider.");
  }
  return context;
};

