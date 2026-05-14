"use server";

import { prisma } from "@/lib/db";
import { awardXp, evaluateAchievements } from "@/lib/gamification";
import { refreshPaths, requireSessionUser } from "@/lib/action-helpers";

export async function createPostAction(formData: FormData) {
  const user = await requireSessionUser();

  await prisma.post.create({
    data: {
      userId: user.id,
      content: String(formData.get("content") ?? ""),
      mood: String(formData.get("mood") ?? "") || null,
      imageData: String(formData.get("imageData") ?? "") || null,
    },
  });

  await awardXp(user.id, 24);
  refreshPaths(["/community"]);
}

export async function toggleLikeAction(postId: string) {
  const user = await requireSessionUser();
  const existing = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: user.id,
      },
    },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    await prisma.post.update({
      where: { id: postId },
      data: {
        likesCount: {
          decrement: 1,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: {
        postId,
        userId: user.id,
      },
    });
    await prisma.post.update({
      where: { id: postId },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });
    await awardXp(user.id, 5);
    await evaluateAchievements(user.id);
  }

  refreshPaths(["/community"]);
}

export async function createCommentAction(formData: FormData) {
  const user = await requireSessionUser();
  const postId = String(formData.get("postId") ?? "");
  const content = String(formData.get("content") ?? "");

  await prisma.comment.create({
    data: {
      postId,
      userId: user.id,
      content,
    },
  });

  await prisma.post.update({
    where: { id: postId },
    data: {
      commentsCount: {
        increment: 1,
      },
    },
  });

  await awardXp(user.id, 9);
  refreshPaths(["/community"]);
}

export async function toggleFollowAction(targetUserId: string) {
  const user = await requireSessionUser();

  if (user.id === targetUserId) {
    return;
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: targetUserId,
      },
    });
    await awardXp(user.id, 6);
  }

  refreshPaths(["/community"]);
}
