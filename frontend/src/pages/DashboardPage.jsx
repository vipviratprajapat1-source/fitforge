import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProgressChart } from "@/components/ProgressChart";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { WorkoutCard } from "@/components/WorkoutCard";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { formatCalories, formatMinutes } from "@/utils/formatters";

const buildWeeklyPreview = (history) => {
  const map = new Map();
  (history || []).slice(0, 14).forEach((entry) => {
    const key = String(entry.completedAt).slice(5, 10);
    map.set(key, {
      label: key,
      workouts: (map.get(key)?.workouts || 0) + 1,
      calories: (map.get(key)?.calories || 0) + entry.caloriesBurned,
    });
  });
  return [...map.values()].reverse();
};

export default function DashboardPage() {
  const auth = useAuth();
  const {
    user,
    dashboard,
    badges,
    completeWorkout,
    addGoalTracker,
    requestReminderPermission,
    updateProfile,
  } = useAppData();
  const [goalDraft, setGoalDraft] = useState("6 pack in 30 days");
  const [profileDraft, setProfileDraft] = useState({
    ageGroup: user.profile.ageGroup,
    gender: user.profile.gender,
    fitnessLevel: user.profile.fitnessLevel,
    goals: user.profile.goals,
    injuries: user.profile.injuries.join(", "),
    dailyReminderTime: user.settings.dailyReminderTime,
    voiceGuidance: user.settings.voiceGuidance,
    smartReminders: user.settings.smartReminders,
  });
  const [installPrompt, setInstallPrompt] = useState(null);
  const chartData = useMemo(() => buildWeeklyPreview(user.history), [user.history]);

  useEffect(() => {
    setProfileDraft({
      ageGroup: user.profile.ageGroup,
      gender: user.profile.gender,
      fitnessLevel: user.profile.fitnessLevel,
      goals: user.profile.goals,
      injuries: user.profile.injuries.join(", "),
      dailyReminderTime: user.settings.dailyReminderTime,
      voiceGuidance: user.settings.voiceGuidance,
      smartReminders: user.settings.smartReminders,
    });
  }, [user]);

  useEffect(() => {
    const handleInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleInstall);
  }, []);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card overflow-hidden">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgb(var(--text-soft))" }}>
                Daily motivation
              </p>
              <h2 className="mt-3 font-display text-4xl leading-tight">{dashboard.quote}</h2>
              <p className="mt-4 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                AI suggestion: based on your {user.profile.fitnessLevel.toLowerCase()} profile and
                goal of {user.profile.goals[0].toLowerCase()}, a{" "}
                {dashboard.quickStart?.duration || 15}-minute session is your best move today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {installPrompt ? (
                <button
                  type="button"
                  className="button-secondary"
                  onClick={async () => {
                    await installPrompt.prompt();
                    setInstallPrompt(null);
                  }}
                >
                  Install app
                </button>
              ) : null}
              <button type="button" className="button-secondary" onClick={requestReminderPermission}>
                Enable reminders
              </button>
              {dashboard.quickStart ? (
                <Link className="button-primary" to={`/session/${dashboard.quickStart.id}`}>
                  Quick start workout
                </Link>
              ) : null}
            </div>
          </div>

          {dashboard.quickStart ? (
            <div className="mt-8 grid gap-4 rounded-[28px] bg-slate-950/90 p-6 text-white md:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Suggested workout</p>
                <p className="mt-3 text-2xl font-semibold">{dashboard.quickStart.title}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Duration</p>
                <p className="mt-3 text-2xl font-semibold">
                  {formatMinutes(dashboard.quickStart.duration)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Burn</p>
                <p className="mt-3 text-2xl font-semibold">
                  {formatCalories(dashboard.quickStart.caloriesBurned)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Target</p>
                <p className="mt-3 text-2xl font-semibold">
                  {dashboard.quickStart.targetMuscles?.[0] || "Full Body"}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="surface-card">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgb(var(--text-soft))" }}>
            Daily challenge mode
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{dashboard.dailyChallenge.title}</h3>
          <p className="mt-3 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
            {dashboard.dailyChallenge.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="chip">{dashboard.dailyChallenge.rewardXp} XP reward</span>
            <span className="chip">{dashboard.todayCompleted ? "Completed today" : "Ready today"}</span>
          </div>
          <div className="mt-6 flex gap-3">
            <Link className="button-primary" to={`/session/${dashboard.dailyChallenge.workoutId}`}>
              Start challenge
            </Link>
            <button
              type="button"
              className="button-secondary"
              onClick={() => addGoalTracker({ title: goalDraft, target: 30, metric: "days" })}
            >
              Track 30-day goal
            </button>
          </div>
          <input
            className="input-field mt-4"
            value={goalDraft}
            onChange={(event) => setGoalDraft(event.target.value)}
            placeholder="Goal tracker title"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current streak" value={`${user.stats.streak} days`} hint="Train daily to keep the chain alive." />
        <StatCard label="Total workouts" value={user.stats.totalWorkouts} hint="Every session adds to your public record." accent="from-sky-500/20 to-cyan-400/10" />
        <StatCard label="Calories burned" value={user.stats.totalCalories} hint="Estimated total energy burned across all sessions." accent="from-amber-500/20 to-orange-400/10" />
        <StatCard label="XP and level" value={`${user.stats.xp} XP - Lv ${user.stats.level}`} hint="Level-ups reward consistency without locking content." accent="from-fuchsia-500/20 to-rose-400/10" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <SectionHeader
            eyebrow="AI suggestions"
            title="Best workouts for today"
            description="Recommended from your goals, level, age group, and recent training history."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {dashboard.recommendations.slice(0, 4).map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} highlight={workout.id === dashboard.quickStart?.id}>
                <button type="button" className="button-primary" onClick={() => completeWorkout(workout.id)}>
                  Mark done
                </button>
              </WorkoutCard>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <SectionHeader
              eyebrow="Badges"
              title="Achievement shelf"
              description="Rewards only. Nothing is locked."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {badges.map((badge) => {
                const achieved = user.stats.achievements?.some((item) => item.id === badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`rounded-[24px] border p-4 ${achieved ? "bg-rose-500/10" : "bg-transparent"}`}
                    style={{ borderColor: "rgba(var(--stroke), 0.65)" }}
                  >
                    <p className="font-semibold">{badge.title}</p>
                    <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                      {badge.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow="Goal tracker"
              title="Current missions"
              description="Set targets like six pack in 30 days and keep them moving."
            />
            <div className="space-y-3">
              {user.goalTrackers.length ? (
                user.goalTrackers.map((goal) => (
                  <div key={goal.id} className="surface-card">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{goal.title}</p>
                        <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                          {goal.current}/{goal.target} {goal.metric}
                        </p>
                      </div>
                      <span className="chip">{goal.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="surface-card text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                  No goal trackers yet. Create one from the challenge card above.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div>
          <SectionHeader
            eyebrow="Trendline"
            title="Last sessions"
            description="A quick view of your recent workout frequency."
          />
          <ProgressChart data={chartData} metric="workouts" tone="#fb7185" />
        </div>
        <div>
          <SectionHeader
            eyebrow="Fast links"
            title="Keep moving"
            description="Jump into the parts of the platform that drive momentum."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Link className="surface-card hover:-translate-y-1" to="/builder">
              <p className="text-xl font-semibold">Custom workout builder</p>
              <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                Drag, reorder, edit, and save your own routines.
              </p>
            </Link>
            <Link className="surface-card hover:-translate-y-1" to="/social">
              <p className="text-xl font-semibold">Friends and challenges</p>
              <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                Compare progress, challenge friends, and climb your level ladder.
              </p>
            </Link>
            <Link className="surface-card hover:-translate-y-1" to="/meals">
              <p className="text-xl font-semibold">Meal planner</p>
              <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                Goal-based vegetarian and non-vegetarian daily plans.
              </p>
            </Link>
            <Link className="surface-card hover:-translate-y-1" to="/calendar">
              <p className="text-xl font-semibold">Calendar mode</p>
              <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                See your training consistency like a study planner.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {!auth.isAuthenticated ? (
        <div className="surface-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Running in guest mode</h3>
            <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              Your data stays saved locally even after closing the tab. Create an account when you
              want MongoDB sync, cloud friends, and persistent social competition.
            </p>
          </div>
          <Link className="button-primary" to="/auth">
            Upgrade to cloud account
          </Link>
        </div>
      ) : null}

      <section className="surface-card">
        <SectionHeader
          eyebrow="Profile and settings"
          title="Personalization controls"
          description="Update age group, gender, goals, injury notes, reminder timing, and optional voice guidance."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Age group</span>
            <select
              className="input-field"
              value={profileDraft.ageGroup}
              onChange={(event) => setProfileDraft((current) => ({ ...current, ageGroup: event.target.value }))}
            >
              <option>Below 18</option>
              <option>Above 18</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Gender</span>
            <select
              className="input-field"
              value={profileDraft.gender}
              onChange={(event) => setProfileDraft((current) => ({ ...current, gender: event.target.value }))}
            >
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Fitness level</span>
            <select
              className="input-field"
              value={profileDraft.fitnessLevel}
              onChange={(event) =>
                setProfileDraft((current) => ({ ...current, fitnessLevel: event.target.value }))
              }
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Pro</option>
              <option>Max</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Daily reminder</span>
            <input
              className="input-field"
              type="time"
              value={profileDraft.dailyReminderTime}
              onChange={(event) =>
                setProfileDraft((current) => ({ ...current, dailyReminderTime: event.target.value }))
              }
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Goals</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {["Fat loss", "Muscle gain", "Six pack", "Biceps", "Height growth", "Full body"].map((goal) => (
                <label key={goal} className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={profileDraft.goals.includes(goal)}
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        goals: event.target.checked
                          ? [...current.goals, goal]
                          : current.goals.filter((item) => item !== goal),
                      }))
                    }
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Body issues or injuries</span>
            <textarea
              className="input-field min-h-40"
              placeholder="Examples: knee pain, back pain"
              value={profileDraft.injuries}
              onChange={(event) => setProfileDraft((current) => ({ ...current, injuries: event.target.value }))}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3">
            <input
              type="checkbox"
              checked={profileDraft.voiceGuidance}
              onChange={(event) =>
                setProfileDraft((current) => ({ ...current, voiceGuidance: event.target.checked }))
              }
            />
            <span>Voice guidance</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3">
            <input
              type="checkbox"
              checked={profileDraft.smartReminders}
              onChange={(event) =>
                setProfileDraft((current) => ({ ...current, smartReminders: event.target.checked }))
              }
            />
            <span>Smart inactivity reminders</span>
          </label>
          <button
            type="button"
            className="button-primary"
            onClick={() =>
              updateProfile({
                profile: {
                  ageGroup: profileDraft.ageGroup,
                  gender: profileDraft.gender,
                  fitnessLevel: profileDraft.fitnessLevel,
                  goals: profileDraft.goals.length ? profileDraft.goals : ["Full body"],
                  injuries: profileDraft.injuries
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                },
                settings: {
                  dailyReminderTime: profileDraft.dailyReminderTime,
                  voiceGuidance: profileDraft.voiceGuidance,
                  smartReminders: profileDraft.smartReminders,
                },
              })
            }
          >
            Save profile settings
          </button>
        </div>
      </section>
    </div>
  );
}
