import { useEffect, useMemo, useRef, useState } from "react";
import { ExerciseVisual } from "@/components/ExerciseVisual";

export const WorkoutPlayer = ({ workout, voiceGuidance, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("work");
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);

  const currentExercise = workout.exercises[currentIndex];
  const [timeLeft, setTimeLeft] = useState(currentExercise?.workSeconds || 0);

  useEffect(() => {
    setCurrentIndex(0);
    setPhase("work");
    setPlaying(false);
    setCompleted(false);
    completedRef.current = false;
    setTimeLeft(workout.exercises[0]?.workSeconds || 0);
  }, [workout.id]);

  useEffect(() => {
    if (!playing || completed) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [playing, completed]);

  useEffect(() => {
    if (!currentExercise || completed || timeLeft > 0) {
      return;
    }

    if (phase === "work" && currentExercise.restSeconds > 0) {
      setPhase("rest");
      setTimeLeft(currentExercise.restSeconds);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= workout.exercises.length) {
      setCompleted(true);
      setPlaying(false);
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }

    setCurrentIndex(nextIndex);
    setPhase("work");
    setTimeLeft(workout.exercises[nextIndex].workSeconds);
  }, [timeLeft, phase, currentExercise, currentIndex, workout.exercises, completed, onComplete]);

  useEffect(() => {
    if (!voiceGuidance || !currentExercise || typeof speechSynthesis === "undefined") {
      return;
    }

    speechSynthesis.cancel();
    const message =
      phase === "work"
        ? `Next exercise: ${currentExercise.name}. ${currentExercise.steps[0]}`
        : `Rest now. ${currentExercise.restSeconds} seconds before the next move.`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1;
    speechSynthesis.speak(utterance);

    return () => speechSynthesis.cancel();
  }, [currentIndex, phase, voiceGuidance, currentExercise]);

  const progress = useMemo(
    () => Math.round(((currentIndex + (completed ? 1 : 0)) / workout.exercises.length) * 100),
    [completed, currentIndex, workout.exercises.length]
  );

  if (!currentExercise) {
    return null;
  }

  return (
    <div className="surface-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgb(var(--text-soft))" }}>
            Live workout player
          </p>
          <h3 className="mt-2 text-2xl font-semibold">{completed ? "Workout completed" : currentExercise.name}</h3>
        </div>
        <span className="chip">
          {phase === "rest" ? "Rest" : "Work"} · {currentIndex + 1}/{workout.exercises.length}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <ExerciseVisual animation={currentExercise.animation} />
          <div className="mt-5 rounded-[26px] bg-slate-950/90 p-6 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Countdown</p>
              <p className="text-sm text-slate-400">{progress}% done</p>
            </div>
            <p className="mt-4 font-display text-6xl">{timeLeft}s</p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 to-amber-300 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="button-primary" onClick={() => setPlaying((value) => !value)}>
                {playing ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                className="button-secondary !border-white/20 !bg-white/10 !text-white"
                onClick={() => {
                  setCurrentIndex(0);
                  setPhase("work");
                  setTimeLeft(workout.exercises[0]?.workSeconds || 0);
                  setCompleted(false);
                  completedRef.current = false;
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {currentExercise.steps.map((step) => (
            <div key={step} className="rounded-2xl border border-white/10 px-4 py-3">
              {step}
            </div>
          ))}
          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
            {phase === "rest"
              ? "Breathe deeply, shake out tension, and get ready for the next set."
              : currentExercise.tips?.[0] || "Control the rep and keep your core engaged."}
          </div>
        </div>
      </div>
    </div>
  );
};

