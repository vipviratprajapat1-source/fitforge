import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppData } from "@/context/AppDataContext";
import { formatDate } from "@/utils/formatters";

export default function CalendarPage() {
  const { user, calendarMap, dashboard } = useAppData();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Planner mode"
        title="Calendar view"
        description="Treat your fitness habit like a serious study planner with visible consistency and daily challenge context."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <CalendarHeatmap calendarMap={calendarMap} />
        <section className="surface-card">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgb(var(--text-soft))" }}>
            Daily challenge
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{dashboard.dailyChallenge.title}</h3>
          <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
            {dashboard.dailyChallenge.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="chip">{dashboard.dailyChallenge.rewardXp} XP</span>
            <span className="chip">Date {dashboard.dailyChallenge.date}</span>
          </div>
          <div className="mt-6 rounded-[24px] border border-white/10 p-4">
            <p className="font-semibold">Habit summary</p>
            <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              {user.stats.streak} day streak, {user.stats.totalWorkouts} lifetime sessions, longest
              streak {user.stats.longestStreak} days.
            </p>
          </div>
        </section>
      </div>

      <section className="surface-card">
        <SectionHeader
          eyebrow="Activity feed"
          title="Calendar-linked history"
          description="See which exact dates drove your consistency."
        />
        <div className="space-y-3">
          {user.history.length ? (
            user.history.map((entry) => (
              <div key={`${entry.completedAt}-${entry.workoutId}`} className="rounded-[24px] border border-white/10 p-4">
                <p className="font-semibold">{entry.title}</p>
                <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                  {formatDate(entry.completedAt)} · {entry.duration} min · {entry.caloriesBurned} cal
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/10 p-4 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              No completed days yet. Your first workout will light up the calendar.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

