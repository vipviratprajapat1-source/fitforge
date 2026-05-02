import { getTodayKey } from "@/utils/formatters";

export const CalendarHeatmap = ({ calendarMap }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prefix = Array.from({ length: firstDay.getDay() }, (_, index) => ({ empty: `p-${index}` }));
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(year, month, day);
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      day,
      count: calendarMap[key] || 0,
      isToday: key === getTodayKey(),
    };
  });

  return (
    <div className="surface-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Workout calendar</h3>
        <span className="chip">{today.toLocaleDateString([], { month: "long", year: "numeric" })}</span>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs" style={{ color: "rgb(var(--text-soft))" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
          <p key={label}>{label}</p>
        ))}
        {prefix.map((item) => (
          <div key={item.empty} />
        ))}
        {days.map((day) => (
          <div
            key={day.key}
            className={`rounded-2xl border p-3 ${day.isToday ? "ring-1 ring-rose-400/40" : ""}`}
            style={{
              borderColor: "rgba(var(--stroke), 0.6)",
              background:
                day.count > 0
                  ? `rgba(251, 113, 133, ${Math.min(0.2 + day.count * 0.12, 0.75)})`
                  : "rgba(var(--bg-alt), 0.45)",
            }}
          >
            <p className="font-semibold" style={{ color: "rgb(var(--text-main))" }}>
              {day.day}
            </p>
            <p>{day.count ? `${day.count}x` : "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

