import { useMemo, useState, useTransition } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { WorkoutCard } from "@/components/WorkoutCard";
import { useAppData } from "@/context/AppDataContext";

export default function LibraryPage() {
  const { combinedWorkouts } = useAppData();
  const [filters, setFilters] = useState({
    query: "",
    goal: "All",
    level: "All",
    duration: "All",
    category: "All",
  });
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(
    () =>
      combinedWorkouts.filter((workout) => {
        const haystack = `${workout.title} ${workout.description} ${(workout.tags || []).join(" ")}`.toLowerCase();
        const matchesQuery = haystack.includes(filters.query.toLowerCase());
        const matchesGoal = filters.goal === "All" || workout.goals?.includes(filters.goal);
        const matchesLevel = filters.level === "All" || workout.difficulty === filters.level;
        const matchesDuration =
          filters.duration === "All" || String(workout.duration) === String(filters.duration);
        const matchesCategory =
          filters.category === "All" ||
          workout.category === filters.category ||
          (filters.category === "Custom" && workout.difficulty === "Custom");
        return matchesQuery && matchesGoal && matchesLevel && matchesDuration && matchesCategory;
      }),
    [combinedWorkouts, filters]
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Workout system"
        title={`Workout library${isPending ? "..." : ""}`}
        description="More than 100 unlocked no-equipment plans across ages, goals, durations, women-specific sessions, and injury support."
      />

      <div className="surface-card grid gap-4 md:grid-cols-5">
        <input
          className="input-field md:col-span-2"
          placeholder="Search home workout, six pack, biceps, injury support..."
          onChange={(event) => {
            const value = event.target.value;
            startTransition(() => {
              setFilters((current) => ({ ...current, query: value }));
            });
          }}
        />
        <select
          className="input-field"
          value={filters.goal}
          onChange={(event) => setFilters((current) => ({ ...current, goal: event.target.value }))}
        >
          {["All", "Fat loss", "Muscle gain", "Six pack", "Biceps", "Height growth", "Full body"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          className="input-field"
          value={filters.level}
          onChange={(event) => setFilters((current) => ({ ...current, level: event.target.value }))}
        >
          {["All", "Beginner", "Intermediate", "Pro", "Max", "Custom"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          className="input-field"
          value={filters.duration}
          onChange={(event) => setFilters((current) => ({ ...current, duration: event.target.value }))}
        >
          {["All", 10, 15, 20, 25, 30, 45, 60].map((option) => (
            <option key={String(option)} value={String(option)}>
              {option}
            </option>
          ))}
        </select>
        <select
          className="input-field"
          value={filters.category}
          onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
        >
          {["All", "Goal Based", "Women Specific", "Injury Support", "Custom"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {filtered.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}

