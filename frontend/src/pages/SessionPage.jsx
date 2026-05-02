import { useState } from "react";
import { useParams } from "react-router-dom";
import { SectionHeader } from "@/components/SectionHeader";
import { WorkoutPlayer } from "@/components/WorkoutPlayer";
import { useAppData } from "@/context/AppDataContext";
import { formatCalories, formatMinutes } from "@/utils/formatters";

export default function SessionPage() {
  const { workoutId } = useParams();
  const { combinedWorkouts, completeWorkout, user } = useAppData();
  const [done, setDone] = useState(false);

  const workout = combinedWorkouts.find((item) => item.id === workoutId);

  if (!workout) {
    return (
      <div className="surface-card">
        <p className="text-xl font-semibold">Workout not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Workout session"
        title={workout.title}
        description={workout.description}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-tile">
          <p className="text-sm" style={{ color: "rgb(var(--text-soft))" }}>
            Duration
          </p>
          <p className="mt-3 text-3xl font-semibold">{formatMinutes(workout.duration)}</p>
        </div>
        <div className="metric-tile">
          <p className="text-sm" style={{ color: "rgb(var(--text-soft))" }}>
            Calories
          </p>
          <p className="mt-3 text-3xl font-semibold">{formatCalories(workout.caloriesBurned || 0)}</p>
        </div>
        <div className="metric-tile">
          <p className="text-sm" style={{ color: "rgb(var(--text-soft))" }}>
            Difficulty
          </p>
          <p className="mt-3 text-3xl font-semibold">{workout.difficulty}</p>
        </div>
        <div className="metric-tile">
          <p className="text-sm" style={{ color: "rgb(var(--text-soft))" }}>
            Voice guidance
          </p>
          <p className="mt-3 text-3xl font-semibold">{user.settings.voiceGuidance ? "On" : "Off"}</p>
        </div>
      </div>

      <WorkoutPlayer
        workout={workout}
        voiceGuidance={user.settings.voiceGuidance}
        onComplete={async () => {
          if (!done) {
            await completeWorkout(workout.id);
            setDone(true);
          }
        }}
      />

      <section className="surface-card">
        <h3 className="text-2xl font-semibold">Step-by-step exercises</h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {workout.exercises.map((exercise, index) => (
            <div key={exercise.id} className="rounded-[24px] border border-white/10 p-4">
              <p className="font-semibold">
                {index + 1}. {exercise.name}
              </p>
              <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                {exercise.muscleGroup} · {exercise.workSeconds}s work / {exercise.restSeconds}s rest
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {exercise.steps.map((step) => (
                  <li key={step} className="rounded-2xl bg-black/5 px-3 py-2 dark:bg-white/5">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

