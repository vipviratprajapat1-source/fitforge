export const ExerciseVisual = ({ animation = "march" }) => {
  const palette =
    animation === "plank-hold"
      ? "from-sky-400 to-cyan-300"
      : animation === "squat"
        ? "from-amber-400 to-orange-500"
        : animation === "boxing"
          ? "from-rose-400 to-fuchsia-500"
          : "from-emerald-400 to-cyan-400";

  return (
    <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-[24px] bg-slate-950/90">
      <div className={`absolute h-24 w-24 rounded-full bg-gradient-to-br ${palette} opacity-70 blur-xl`} />
      <div className="absolute h-20 w-20 animate-orbit rounded-full border border-white/20" />
      <div className="relative flex items-end gap-2">
        <div className="h-10 w-3 rounded-full bg-white/80" />
        <div className="h-16 w-4 animate-pulseSoft rounded-full bg-white" />
        <div className="h-12 w-3 rounded-full bg-white/80" />
      </div>
    </div>
  );
};

