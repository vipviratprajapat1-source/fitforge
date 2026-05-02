const levelOrder = ["Beginner", "Intermediate", "Pro", "Max"];

export const LeaderboardColumns = ({ leaderboards }) => (
  <div className="grid gap-4 xl:grid-cols-4">
    {levelOrder.map((level) => (
      <section key={level} className="surface-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgb(var(--text-soft))" }}>
              Separate ladder
            </p>
            <h3 className="mt-2 text-xl font-semibold">{level}</h3>
          </div>
          <span className="chip">{(leaderboards[level] || []).length} athletes</span>
        </div>
        <div className="space-y-3">
          {(leaderboards[level] || []).slice(0, 6).map((entry) => (
            <div
              key={`${level}-${entry.username}`}
              className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold">
                  #{entry.rank} {entry.name}
                </p>
                <p className="text-xs" style={{ color: "rgb(var(--text-soft))" }}>
                  @{entry.username}
                </p>
              </div>
              <div className="text-right text-sm">
                <p>{entry.streak} day streak</p>
                <p style={{ color: "rgb(var(--text-soft))" }}>{entry.totalWorkouts} workouts</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}
  </div>
);

