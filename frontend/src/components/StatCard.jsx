export const StatCard = ({ label, value, hint, accent = "from-rose-500/20 to-amber-400/10" }) => (
  <div className={`metric-tile bg-gradient-to-br ${accent}`}>
    <p className="text-sm" style={{ color: "rgb(var(--text-soft))" }}>
      {label}
    </p>
    <p className="mt-3 font-display text-3xl">{value}</p>
    <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
      {hint}
    </p>
  </div>
);

