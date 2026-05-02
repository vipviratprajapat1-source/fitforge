import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { ExerciseVisual } from "@/components/ExerciseVisual";
import { useAppData } from "@/context/AppDataContext";
import { createCustomWorkoutDraft } from "@/utils/fitnessEngine";
import { EXERCISE_LIBRARY } from "@shared/fitnessData.js";

const blankWorkout = createCustomWorkoutDraft();

export default function BuilderPage() {
  const { customWorkouts, saveCustomWorkout, deleteCustomWorkout } = useAppData();
  const [draft, setDraft] = useState(blankWorkout);
  const [dragIndex, setDragIndex] = useState(null);
  const [status, setStatus] = useState("");

  const addExercise = (exercise) => {
    setDraft((current) => ({
      ...current,
      exercises: [
        ...current.exercises,
        {
          id: `${exercise.id}-${current.exercises.length + 1}`,
          name: exercise.name,
          exerciseId: exercise.id,
          muscleGroup: exercise.muscleGroup,
          steps: exercise.steps,
          animation: exercise.animation,
          workSeconds: exercise.defaultSeconds,
          restSeconds: current.restSeconds,
          tips: ["Stay controlled and keep your breathing steady."],
        },
      ],
      targetMuscles: Array.from(new Set([...current.targetMuscles, exercise.muscleGroup])),
    }));
  };

  const save = async () => {
    await saveCustomWorkout(draft);
    setStatus("Custom workout saved.");
    setDraft(createCustomWorkoutDraft());
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Custom workout builder"
        title="Drag, drop, and design your own routines"
        description="Add exercises, reorder them, set durations and rest, then save to your personal library."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="surface-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Exercise bank</h3>
            <span className="chip">{EXERCISE_LIBRARY.length} moves</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {EXERCISE_LIBRARY.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                draggable
                onDragStart={(event) => event.dataTransfer.setData("exercise", JSON.stringify(exercise))}
                onClick={() => addExercise(exercise)}
                className="rounded-[24px] border border-white/10 p-4 text-left transition hover:-translate-y-1"
              >
                <ExerciseVisual animation={exercise.animation} />
                <p className="mt-3 font-semibold">{exercise.name}</p>
                <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                  {exercise.muscleGroup}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section
          className="surface-card"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const raw = event.dataTransfer.getData("exercise");
            if (raw) {
              addExercise(JSON.parse(raw));
            }
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="input-field"
              placeholder="Workout title"
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            />
            <input
              className="input-field"
              placeholder="Description"
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
            />
            <input
              className="input-field"
              type="number"
              min="10"
              max="90"
              placeholder="Duration"
              value={draft.duration}
              onChange={(event) => setDraft((current) => ({ ...current, duration: Number(event.target.value) }))}
            />
            <input
              className="input-field"
              type="number"
              min="5"
              max="60"
              placeholder="Rest seconds"
              value={draft.restSeconds}
              onChange={(event) => setDraft((current) => ({ ...current, restSeconds: Number(event.target.value) }))}
            />
          </div>

          <div className="mt-5 rounded-[28px] border border-dashed border-white/10 p-5">
            <p className="text-sm font-medium">Drop exercises here or click cards to add them.</p>
            <div className="mt-4 space-y-3">
              {draft.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (dragIndex === null || dragIndex === index) {
                      return;
                    }
                    const updated = [...draft.exercises];
                    const [moved] = updated.splice(dragIndex, 1);
                    updated.splice(index, 0, moved);
                    setDraft((current) => ({ ...current, exercises: updated }));
                    setDragIndex(null);
                  }}
                  className="flex flex-col gap-3 rounded-[22px] border border-white/10 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {index + 1}. {exercise.name}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                      {exercise.muscleGroup} · {exercise.workSeconds}s work / {exercise.restSeconds}s rest
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          exercises: current.exercises.filter((item) => item.id !== exercise.id),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="button-primary" onClick={save} disabled={!draft.title || !draft.exercises.length}>
              Save custom workout
            </button>
            <button type="button" className="button-secondary" onClick={() => setDraft(createCustomWorkoutDraft())}>
              Reset builder
            </button>
            {status ? <span className="chip">{status}</span> : null}
          </div>
        </section>
      </div>

      <section className="surface-card">
        <SectionHeader
          eyebrow="Saved plans"
          title="Your custom library"
          description="Edit, reuse, or delete routines you have built."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {customWorkouts.length ? (
            customWorkouts.map((workout) => (
              <div key={workout.id} className="rounded-[24px] border border-white/10 p-4">
                <p className="text-xl font-semibold">{workout.title}</p>
                <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                  {workout.duration} min · {workout.exercises.length} exercises
                </p>
                <div className="mt-4 flex gap-2">
                  <button type="button" className="button-secondary" onClick={() => setDraft(createCustomWorkoutDraft(workout))}>
                    Edit
                  </button>
                  <button type="button" className="button-secondary" onClick={() => deleteCustomWorkout(workout.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/10 p-5 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              No custom workouts yet. Build one above and it will appear here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

