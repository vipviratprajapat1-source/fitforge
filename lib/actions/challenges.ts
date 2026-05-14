"use server";

import { prisma } from "@/lib/db";
import { awardXp } from "@/lib/gamification";
import { refreshPaths, requireSessionUser } from "@/lib/action-helpers";

export async function joinChallengeAction(challengeId: string) {
  const user = await requireSessionUser();
  const existing = await prisma.challengeEntry.findUnique({
    where: {
      challengeId_userId: {
        challengeId,
        userId: user.id,
      },
    },
  });

  if (!existing) {
    await prisma.challengeEntry.create({
      data: {
        challengeId,
        userId: user.id,
      },
    });

    await awardXp(user.id, 18);
  }

  refreshPaths(["/challenges", "/dashboard"]);
}

export async function updateChallengeProgressAction(challengeId: string, progress: number) {
  const user = await requireSessionUser();

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) {
    return;
  }

  const updated = await prisma.challengeEntry.upsert({
    where: {
      challengeId_userId: {
        challengeId,
        userId: user.id,
      },
    },
    update: {
      progress,
      completed: progress >= challenge.targetValue,
    },
    create: {
      challengeId,
      userId: user.id,
      progress,
      completed: progress >= challenge.targetValue,
    },
  });

  if (updated.completed) {
    await awardXp(user.id, challenge.rewardXp);
  }

  refreshPaths(["/challenges", "/dashboard"]);
}
