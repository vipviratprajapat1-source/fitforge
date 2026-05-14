"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Heart,
  PlayCircle,
  Plus,
  Search,
  Trash2,
  Video,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { logWorkoutCompletionAction, saveRoutineAction, toggleFavoriteWorkoutAction } from "@/lib/actions/workouts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Exercise = {
  id: string;
  name: string;
  description: string;
  category: string;
  muscleGroup: string;
  difficulty: string;
  equipment: string;
  durationMinutes: number;
  videoUrl: string | null;
  tags: string;
};

type Routine = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationMinutes: number;
  estimatedCalories: number;
  focusArea: string;
  musicUrl: string | null;
  isTemplate: boolean;
  isFavorite: boolean;
  items: {
    id: string;
    sortOrder: number;
    sets: number | null;
    reps: string | null;
    durationSeconds: number | null;
    restSeconds: number | null;
    notes: string | null;
    exercise: {
      id: string;
      name: string;
      muscleGroup: string;
    };
  }[];
};

type BuilderItem = {
  id: string;
  name: string;
  exerciseId: string;
  sets: number;
  reps: string;
  durationSeconds: number;
  restSeconds: number;
  notes: string;
};

function SortableBuilderItem({
  item,
  onChange,
  onRemove,
}: {
  item: BuilderItem;
  onChange: (next: BuilderItem) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="rounded-[1.5rem] bg-surface-soft p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          className="cursor-grab text-left"
          {...attributes}
          {...listeners}
        >
          <p className="font-semibold">{item.name}</p>
          <p className="mt-1 text-sm text-muted">Drag to reorder</p>
        </button>
        <button type="button" onClick={onRemove} className="text-danger">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Input
          type="number"
          value={item.sets}
          onChange={(event) => onChange({ ...item, sets: Number(event.target.value) })}
          placeholder="Sets"
        />
        <Input
          value={item.reps}
          onChange={(event) => onChange({ ...item, reps: event.target.value })}
          placeholder="Reps"
        />
        <Input
          type="number"
          value={item.durationSeconds}
          onChange={(event) => onChange({ ...item, durationSeconds: Number(event.target.value) })}
          placeholder="Duration (sec)"
        />
        <Input
          type="number"
          value={item.restSeconds}
          onChange={(event) => onChange({ ...item, restSeconds: Number(event.target.value) })}
          placeholder="Rest (sec)"
        />
      </div>
      <Input
        className="mt-3"
        value={item.notes}
        onChange={(event) => onChange({ ...item, notes: event.target.value })}
        placeholder="Optional coaching note"
      />
    </div>
  );
}

export function WorkoutStudio({
  exercises,
  routines,
}: {
  exercises: Exercise[];
  routines: Routine[];
}) {
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor));
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [builderDifficulty, setBuilderDifficulty] = useState("INTERMEDIATE");
  const [builderTitle, setBuilderTitle] = useState("My custom session");
  const [builderDescription, setBuilderDescription] = useState("A focused routine built inside Fitnity.");
  const [builderCategory, setBuilderCategory] = useState("Custom");
  const [builderFocus, setBuilderFocus] = useState("Full-body");
  const [builderItems, setBuilderItems] = useState<BuilderItem[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(search.toLowerCase()) ||
        exercise.tags.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty =
        difficulty === "ALL" || exercise.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [difficulty, exercises, search]);

  function addExercise(exercise: Exercise) {
    setBuilderItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: exercise.name,
        exerciseId: exercise.id,
        sets: 3,
        reps: "10",
        durationSeconds: exercise.durationMinutes * 60,
        restSeconds: 45,
        notes: "",
      },
    ]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = builderItems.findIndex((item) => item.id === active.id);
    const newIndex = builderItems.findIndex((item) => item.id === over.id);
    setBuilderItems((items) => arrayMove(items, oldIndex, newIndex));
  }

  async function saveRoutine() {
    if (!builderItems.length) {
      toast.error("Add at least one exercise to save a routine.");
      return;
    }

    startTransition(async () => {
      await saveRoutineAction({
        title: builderTitle,
        description: builderDescription,
        category: builderCategory,
        difficulty: builderDifficulty,
        focusArea: builderFocus,
        durationMinutes: Math.ceil(
          builderItems.reduce((sum, item) => sum + item.durationSeconds + item.restSeconds * item.sets, 0) /
            60,
        ),
        estimatedCalories: builderItems.length * 42,
        items: builderItems.map((item) => ({
          exerciseId: item.exerciseId,
          sets: item.sets,
          reps: item.reps,
          durationSeconds: item.durationSeconds,
          restSeconds: item.restSeconds,
          notes: item.notes,
        })),
      });

      toast.success("Routine saved.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm text-muted">Exercise library</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-muted" />
            <Input
              className="pl-11"
              placeholder="Search by exercise or tag"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="ALL">All levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </Select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="rounded-[1.5rem] bg-surface-soft p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{exercise.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {exercise.category} · {exercise.muscleGroup.toLowerCase()} · {exercise.equipment}
                  </p>
                </div>
                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted">
                  {exercise.difficulty.toLowerCase()}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted">{exercise.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => addExercise(exercise)}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
                {exercise.videoUrl ? (
                  <Button variant="ghost" onClick={() => setVideoUrl(exercise.videoUrl)}>
                    <Video className="h-4 w-4" />
                    Video
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <p className="text-sm text-muted">Workout builder</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input value={builderTitle} onChange={(event) => setBuilderTitle(event.target.value)} />
            <Input value={builderFocus} onChange={(event) => setBuilderFocus(event.target.value)} />
          </div>
          <Input
            className="mt-4"
            value={builderDescription}
            onChange={(event) => setBuilderDescription(event.target.value)}
          />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              value={builderCategory}
              onChange={(event) => setBuilderCategory(event.target.value)}
            />
            <Select
              value={builderDifficulty}
              onChange={(event) => setBuilderDifficulty(event.target.value)}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </Select>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={builderItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="mt-5 space-y-3">
                {builderItems.length ? (
                  builderItems.map((item) => (
                    <SortableBuilderItem
                      key={item.id}
                      item={item}
                      onChange={(next) =>
                        setBuilderItems((current) =>
                          current.map((entry) => (entry.id === item.id ? next : entry)),
                        )
                      }
                      onRemove={() =>
                        setBuilderItems((current) => current.filter((entry) => entry.id !== item.id))
                      }
                    />
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-soft p-6 text-sm text-muted">
                    Add exercises from the library, then drag them into your ideal order.
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>

          <Button className="mt-5" onClick={saveRoutine} disabled={pending}>
            Save routine
          </Button>
        </Card>

        <Card>
          <p className="text-sm text-muted">Saved routines</p>
          <div className="mt-5 space-y-4">
            {routines.map((routine) => (
              <div key={routine.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{routine.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {routine.durationMinutes} min · {routine.focusArea}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={routine.isFavorite ? "text-danger" : "text-muted"}
                    onClick={() =>
                      startTransition(async () => {
                        await toggleFavoriteWorkoutAction(routine.id);
                        toast.success(
                          routine.isFavorite ? "Removed from favorites." : "Added to favorites.",
                        );
                        router.refresh();
                      })
                    }
                  >
                    <Heart className={`h-5 w-5 ${routine.isFavorite ? "fill-current" : ""}`} />
                  </button>
                </div>
                <p className="mt-3 text-sm text-muted">{routine.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      startTransition(async () => {
                        await logWorkoutCompletionAction({
                          routineId: routine.id,
                          title: routine.title,
                          durationMinutes: routine.durationMinutes,
                          caloriesBurned: routine.estimatedCalories,
                        });
                        toast.success("Workout session logged.");
                        router.refresh();
                      })
                    }
                  >
                    <PlayCircle className="h-4 w-4" />
                    Log completed workout
                  </Button>
                  {routine.musicUrl ? (
                    <a href={routine.musicUrl} target="_blank" className="inline-flex">
                      <Button variant="secondary">Open music</Button>
                    </a>
                  ) : null}
                </div>
                <div className="mt-4 grid gap-2">
                  {routine.items.map((item) => (
                    <div key={item.id} className="rounded-[1rem] bg-background/60 px-3 py-2 text-sm">
                      {item.sortOrder}. {item.exercise.name}
                      {item.reps ? ` · ${item.reps}` : ""}
                      {item.sets ? ` · ${item.sets} sets` : ""}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {videoUrl ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass-panel w-full max-w-3xl rounded-[2rem] p-4">
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setVideoUrl(null)}>
                Close
              </Button>
            </div>
            <div className="aspect-video overflow-hidden rounded-[1.5rem]">
              <iframe
                src={videoUrl.replace("watch?v=", "embed/")}
                className="h-full w-full"
                allowFullScreen
                title="Exercise video"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
