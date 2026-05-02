export const ProgressChart = ({ data, metric, tone = "#fb7185" }) => {
  if (!data?.length) {
    return (
      <div className="surface-card text-sm" style={{ color: "rgb(var(--text-soft))" }}>
        Not enough progress data yet. Finish a few workouts and this chart will light up.
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item[metric] || 0), 1);
  const points = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 100 - ((item[metric] || 0) / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="surface-card">
      <svg viewBox="0 0 100 100" className="h-48 w-full overflow-visible">
        <polyline
          fill="none"
          stroke={tone}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
        {data.map((item, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * 100;
          const y = 100 - ((item[metric] || 0) / maxValue) * 100;
          return <circle key={`${item.label}-${metric}`} cx={x} cy={y} r="2.8" fill={tone} />;
        })}
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 p-3">
            <p className="text-xs" style={{ color: "rgb(var(--text-soft))" }}>
              {item.label}
            </p>
            <p className="mt-1 text-lg font-semibold">{item[metric]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

