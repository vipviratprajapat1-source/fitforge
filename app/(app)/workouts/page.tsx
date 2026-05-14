import { WorkoutStudio } from "@/components/workouts/workout-studio";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function WorkoutsPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const [exercises, routines, favorites] = await Promise.all([
    prisma.exercise.findMany({
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    }),
    prisma.workoutRoutine.findMany({
      where: {
        OR: [{ isTemplate: true }, { userId }],
      },
      include: {
        items: {
          include: {
            exercise: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: [{ isTemplate: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.favoriteWorkout.findMany({
      where: { userId },
      select: { routineId: true },
    }),
  ]);

  const favoriteSet = new Set(favorites.map((item) => item.routineId));

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Workout system</p>
        <h1 className="mt-3 text-4xl font-semibold">Build, favorite, and finish real routines.</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Explore the exercise library, watch movement videos, drag routines together, save
          custom sessions, and log the work immediately.
        </p>
      </Card>

      <WorkoutStudio
        exercises={exercises}
        routines={routines.map((routine) => ({
          ...routine,
          isFavorite: favoriteSet.has(routine.id),
        }))}
      />
    </div>
  );
}
