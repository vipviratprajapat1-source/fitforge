"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { awardXp, evaluateAchievements, touchStreak } from "@/lib/gamification";
import { requireSessionUser } from "@/lib/action-helpers";
import { slugify } from "@/lib/utils";

type BuilderExercise = {
  exerciseId: string;
  sets?: number | null;
  reps?: string | null;
  durationSeconds?: number | null;
  restSeconds?: number | null;
  notes?: string | null;
};

export async function saveRoutineAction(payload: {
  routineId?: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  focusArea: string;
  durationMinutes: number;
  estimatedCalories: number;
  musicUrl?: string;
  items: BuilderExercise[];
}) {
  const user = await requireSessionUser();
  const slug = `${slugify(payload.title)}-${Math.floor(Math.random() * 900 + 100)}`;

  const routine =
    payload.routineId &&
    (await prisma.workoutRoutine.findFirst({
      where: {
        id: payload.routineId,
        userId: user.id,
      },
    }));

  const savedRoutine = routine
    ? await prisma.workoutRoutine.update({
        where: { id: routine.id },
        data: {
          title: payload.title,
          description: payload.description,
          category: payload.category,
          difficulty: payload.difficulty as never,
          focusArea: payload.focusArea,
          durationMinutes: payload.durationMinutes,
          estimatedCalories: payload.estimatedCalories,
          musicUrl: payload.musicUrl || null,
        },
      })
    : await prisma.workoutRoutine.create({
        data: {
          userId: user.id,
          slug,
          title: payload.title,
          description: payload.description,
          category: payload.category,
          difficulty: payload.difficulty as never,
          focusArea: payload.focusArea,
          durationMinutes: payload.durationMinutes,
          estimatedCalories: payload.estimatedCalories,
          musicUrl: payload.musicUrl || null,
          isTemplate: false,
          isPublished: false,
        },
      });

  await prisma.workoutRoutineItem.deleteMany({
    where: { routineId: savedRoutine.id },
  });

  for (const [index, item] of payload.items.entries()) {
    await prisma.workoutRoutineItem.create({
      data: {
        routineId: savedRoutine.id,
        exerciseId: item.exerciseId,
        sortOrder: index + 1,
        sets: item.sets ?? null,
        reps: item.reps ?? null,
        durationSeconds: item.durationSeconds ?? null,
        restSeconds: item.restSeconds ?? null,
        notes: item.notes ?? null,
      },
    });
  }

  await awardXp(user.id, 42);
  revalidatePath("/workouts");
  return savedRoutine.id;
}

export async function toggleFavoriteWorkoutAction(routineId: string) {
  const user = await requireSessionUser();
  const existing = await prisma.favoriteWorkout.findUnique({
    where: {
      userId_routineId: {
        userId: user.id,
        routineId,
      },
    },
  });

  if (existing) {
    await prisma.favoriteWorkout.delete({ where: { id: existing.id } });
  } else {
    await prisma.favoriteWorkout.create({
      data: {
        userId: user.id,
        routineId,
      },
    });
    await awardXp(user.id, 8);
  }

  revalidatePath("/workouts");
}

export async function logWorkoutCompletionAction(payload: {
  routineId: string;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
}) {
  const user = await requireSessionUser();
  const date = new Date();

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      routineId: payload.routineId,
      type: "WORKOUT",
      title: `Finished ${payload.title}`,
      date,
      durationMinutes: payload.durationMinutes,
      caloriesBurned: payload.caloriesBurned,
      xpEarned: 85,
      completed: true,
    },
  });

  await prisma.dailyMetric.upsert({
    where: {
      userId_date: { userId: user.id, date: new Date(date.toDateString()) },
    },
    update: {
      caloriesBurned: {
        increment: payload.caloriesBurned,
      },
    },
    create: {
      userId: user.id,
      date: new Date(date.toDateString()),
      caloriesBurned: payload.caloriesBurned,
    },
  });

  await touchStreak(user.id, date);
  await awardXp(user.id, 85);
  await evaluateAchievements(user.id);

  await prisma.notification.create({
    data: {
      userId: user.id,
      type: "SYSTEM",
      title: "Workout locked in",
      body: `${payload.title} finished. ${payload.caloriesBurned} calories logged.`,
      link: "/dashboard",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/workouts");
}
