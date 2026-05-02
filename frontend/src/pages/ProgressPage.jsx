import { useMemo, useState } from "react";
import { ProgressChart } from "@/components/ProgressChart";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppData } from "@/context/AppDataContext";
import { formatDate, formatShortDate } from "@/utils/formatters";

const buildSeries = (history) => {
  const weekly = new Map();
  const monthly = new Map();

  (history || []).forEach((entry) => {
    const date = new Date(entry.completedAt);
    const weekKey = `${date.getMonth() + 1}/${Math.ceil(date.getDate() / 7)}`;
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    weekly.set(weekKey, {
      label: weekKey,
      workouts: (weekly.get(weekKey)?.workouts || 0) + 1,
      calories: (weekly.get(weekKey)?.calories || 0) + entry.caloriesBurned,
    });
    monthly.set(monthKey, {
      label: monthKey,
      workouts: (monthly.get(monthKey)?.workouts || 0) + 1,
      calories: (monthly.get(monthKey)?.calories || 0) + entry.caloriesBurned,
    });
  });

  return {
    weekly: [...weekly.values()].slice(-8),
    monthly: [...monthly.values()].slice(-6),
  };
};

export default function ProgressPage() {
  const { user, addBodyProgress, deleteGoalTracker } = useAppData();
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const series = useMemo(() => buildSeries(user.history), [user.history]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Smart tracking system"
        title="Progress and body tracking"
        description="Review streaks, workout history, calorie trends, measurements, badges, and goal tracker movement."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xl font-semibold">Weekly workouts</h3>
          <ProgressChart data={series.weekly} metric="workouts" tone="#38bdf8" />
        </div>
        <div>
          <h3 className="mb-4 text-xl font-semibold">Monthly calories</h3>
          <ProgressChart data={series.monthly} metric="calories" tone="#f59e0b" />
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-card">
          <SectionHeader
            eyebrow="Body progress"
            title="Weight and measurement log"
            description="Optional body tracking to pair with workout consistency."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="input-field"
              type="number"
              step="0.1"
              placeholder="Weight"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
            <input
              className="input-field"
              type="number"
              step="0.1"
              placeholder="Waist"
              value={waist}
              onChange={(event) => setWaist(event.target.value)}
            />
          </div>
          <button
            type="button"
            className="button-primary mt-4"
            onClick={() =>
              addBodyProgress({
                date: new Date().toISOString(),
                weight: Number(weight || 0),
                measurements: { waist: Number(waist || 0) },
              })
            }
          >
            Save body update
          </button>

          <div className="mt-5 space-y-3">
            {user.bodyProgress.length ? (
              user.bodyProgress
                .slice()
                .reverse()
                .map((entry) => (
                  <div key={`${entry.date}-${entry.weight}`} className="rounded-2xl border border-white/10 p-4">
                    <p className="font-semibold">{formatDate(entry.date)}</p>
                    <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                      Weight: {entry.weight || "-"} · Waist: {entry.measurements?.waist || "-"}
                    </p>
                  </div>
                ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                No body progress tracked yet.
              </div>
            )}
          </div>
        </div>

        <div className="surface-card">
          <SectionHeader
            eyebrow="Workout history"
            title="Recent sessions"
            description="Every completed workout updates streaks, XP, calories, and chart data."
          />
          <div className="space-y-3">
            {user.history.length ? (
              user.history.map((entry) => (
                <div key={`${entry.workoutId}-${entry.completedAt}`} className="rounded-[24px] border border-white/10 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{entry.title}</p>
                      <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                        {formatShortDate(entry.completedAt)} · {entry.duration} min · {entry.goal}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p>+{entry.xpEarned} XP</p>
                      <p style={{ color: "rgb(var(--text-soft))" }}>{entry.caloriesBurned} cal</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 p-4 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                No history yet. Complete a workout to start tracking.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="surface-card">
        <SectionHeader
          eyebrow="Goal tracker"
          title="Current goals"
          description="Track programs like 6 pack in 30 days or fat loss streaks."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {user.goalTrackers.length ? (
            user.goalTrackers.map((goal) => (
              <div key={goal.id} className="rounded-[24px] border border-white/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{goal.title}</p>
                    <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                      {goal.current}/{goal.target} {goal.metric} · {goal.status}
                    </p>
                  </div>
                  <button type="button" className="button-secondary" onClick={() => deleteGoalTracker(goal.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/10 p-4 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              No goals created yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

