"use server";

import { differenceInCalendarDays, startOfDay } from "date-fns";

import { prisma } from "@/lib/db";

function levelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / 250) + 1);
}

export async function awardXp(userId: string, amount: number) {
  if (amount <= 0) {
    return null;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: {
        increment: amount,
      },
    },
  });

  const nextLevel = levelFromXp(user.xp);

  if (nextLevel !== user.level) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        level: nextLevel,
      },
    });
  }

  return {
    xp: user.xp,
    level: nextLevel,
  };
}

export async function touchStreak(userId: string, activityDate = new Date()) {
  const streak = await prisma.streak.findUnique({ where: { userId } });
  const currentDate = startOfDay(activityDate);

  if (!streak) {
    await prisma.streak.create({
      data: {
        userId,
        current: 1,
        best: 1,
        lastActiveAt: currentDate,
      },
    });

    return { current: 1, best: 1 };
  }

  const lastActive = streak.lastActiveAt ? startOfDay(streak.lastActiveAt) : null;
  const gap = lastActive ? differenceInCalendarDays(currentDate, lastActive) : 99;

  if (gap === 0) {
    return { current: streak.current, best: streak.best };
  }

  const current = gap === 1 ? streak.current + 1 : 1;
  const best = Math.max(streak.best, current);

  await prisma.streak.update({
    where: { userId },
    data: {
      current,
      best,
      lastActiveAt: currentDate,
    },
  });

  return { current, best };
}

export async function syncDailyMissionProgress(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return [];
  }

  const today = startOfDay(new Date());
  const [missions, metric, entries] = await Promise.all([
    prisma.dailyMission.findMany({
      where: { activeDate: today },
      orderBy: { createdAt: "asc" },
    }),
    prisma.dailyMetric.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    }),
    prisma.nutritionEntry.findMany({
      where: { userId, date: today },
    }),
  ]);

  const proteinTotal = entries.reduce((sum, item) => sum + item.protein, 0);
  const waterMl = metric?.waterMl ?? 0;
  const steps = metric?.steps ?? 0;

  const rewards: { title: string; xpReward: number }[] = [];

  for (const mission of missions) {
    const progress =
      mission.metric === "WATER"
        ? waterMl
        : mission.metric === "PROTEIN"
          ? Math.round(proteinTotal)
          : mission.metric === "STEPS"
            ? steps
            : 0;

    const existing = await prisma.userMissionProgress.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId: mission.id,
        },
      },
    });

    const completed = progress >= mission.targetValue;

    if (!existing) {
      await prisma.userMissionProgress.create({
        data: {
          userId,
          missionId: mission.id,
          progress,
          completedAt: completed ? new Date() : null,
        },
      });

      if (completed) {
        rewards.push({ title: mission.title, xpReward: mission.xpReward });
      }
      continue;
    }

    const newlyCompleted = !existing.completedAt && completed;

    await prisma.userMissionProgress.update({
      where: { userId_missionId: { userId, missionId: mission.id } },
      data: {
        progress,
        completedAt: newlyCompleted ? new Date() : existing.completedAt,
      },
    });

    if (newlyCompleted) {
      rewards.push({ title: mission.title, xpReward: mission.xpReward });
    }
  }

  if (rewards.length) {
    await awardXp(
      userId,
      rewards.reduce((sum, item) => sum + item.xpReward, 0),
    );

    await prisma.notification.createMany({
      data: rewards.map((item) => ({
        userId,
        type: "ACHIEVEMENT",
        title: `Mission cleared: ${item.title}`,
        body: `You banked ${item.xpReward} XP from today's mission board.`,
        link: "/dashboard",
      })),
    });
  }

  return rewards;
}

export async function evaluateAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      streak: true,
      achievements: {
        include: { achievement: true },
      },
      posts: {
        select: {
          likesCount: true,
        },
      },
    },
  });

  if (!user) {
    return [];
  }

  const existing = new Set(user.achievements.map((entry) => entry.achievement.slug));
  const workoutCount = await prisma.activityLog.count({
    where: {
      userId,
      type: "WORKOUT",
      completed: true,
    },
  });

  const metrics = await prisma.dailyMetric.findMany({
    where: { userId },
  });
  const hydrationDays = metrics.filter((item) => item.waterMl >= user.dailyWaterGoalMl).length;

  const nutritionEntries = await prisma.nutritionEntry.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });
  const proteinByDay = new Map<string, number>();
  for (const entry of nutritionEntries) {
    const key = startOfDay(entry.date).toISOString();
    proteinByDay.set(key, (proteinByDay.get(key) ?? 0) + entry.protein);
  }
  const proteinDays = Array.from(proteinByDay.values()).filter(
    (value) => value >= user.dailyProteinGoal,
  ).length;

  const totalLikes = user.posts.reduce((sum, item) => sum + item.likesCount, 0);
  const eligible = [
    user.streak && user.streak.current >= 3 ? "streak-starter" : null,
    hydrationDays >= 5 ? "hydration-hero" : null,
    proteinDays >= 7 ? "macro-master" : null,
    workoutCount >= 10 ? "iron-signal" : null,
    totalLikes >= 25 ? "community-glow" : null,
    user.level >= 10 ? "legend-mode" : null,
  ].filter(Boolean) as string[];

  const unlocked = [];
  let xpReward = 0;

  for (const slug of eligible) {
    if (existing.has(slug)) {
      continue;
    }

    const achievement = await prisma.achievement.findUnique({ where: { slug } });
    if (!achievement) {
      continue;
    }

    await prisma.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
      },
    });

    xpReward += achievement.xpReward;
    unlocked.push(achievement);
  }

  if (xpReward > 0) {
    await awardXp(userId, xpReward);
    await prisma.notification.createMany({
      data: unlocked.map((achievement) => ({
        userId,
        type: "ACHIEVEMENT",
        title: `Achievement unlocked: ${achievement.name}`,
        body: `${achievement.description} +${achievement.xpReward} XP.`,
        link: "/progress",
      })),
    });
  }

  return unlocked;
}
