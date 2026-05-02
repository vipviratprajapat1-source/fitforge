import { Link } from "react-router-dom";
import { formatCalories, formatMinutes } from "@/utils/formatters";

export const WorkoutCard = ({ workout, highlight, children }) => (
  <article
    className={`surface-card flex h-full flex-col justify-between ${highlight ? "ring-1 ring-rose-400/40" : ""}`}
  >
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">{workout.difficulty || "Custom"}</span>
        <span className="chip">{formatMinutes(workout.duration)}</span>
        <span className="chip">{formatCalories(workout.caloriesBurned || 0)}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold">{workout.title}</h3>
      <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
        {workout.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(workout.targetMuscles || []).slice(0, 3).map((target) => (
          <span key={target} className="chip">
            {target}
          </span>
        ))}
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between gap-3">
      <div className="text-sm" style={{ color: "rgb(var(--text-soft))" }}>
        Rest {workout.restSeconds || 20}s
      </div>
      <div className="flex gap-2">
        <Link className="button-secondary" to={`/session/${workout.id}`}>
          View
        </Link>
        {children}
      </div>
    </div>
  </article>
);

