"use server";

import { prisma } from "@/lib/db";
import { awardXp } from "@/lib/gamification";
import { refreshPaths, requireSessionUser } from "@/lib/action-helpers";

export async function createProgressEntryAction(formData: FormData) {
  const user = await requireSessionUser();
  const date = new Date(String(formData.get("date") ?? new Date().toISOString()));
  const weightKg = Number(formData.get("weightKg") ?? 0) || null;

  await prisma.progressEntry.create({
    data: {
      userId: user.id,
      date,
      weightKg,
      bodyFat: Number(formData.get("bodyFat") ?? 0) || null,
      chestCm: Number(formData.get("chestCm") ?? 0) || null,
      waistCm: Number(formData.get("waistCm") ?? 0) || null,
      hipsCm: Number(formData.get("hipsCm") ?? 0) || null,
      armsCm: Number(formData.get("armsCm") ?? 0) || null,
      thighsCm: Number(formData.get("thighsCm") ?? 0) || null,
      notes: String(formData.get("notes") ?? "") || null,
    },
  });

  if (weightKg) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentWeightKg: weightKg,
      },
    });
  }

  await awardXp(user.id, 40);
  refreshPaths(["/progress", "/dashboard"]);
}

export async function createTransformationPhotoAction(formData: FormData) {
  const user = await requireSessionUser();
  const imageData = String(formData.get("imageData") ?? "");

  if (!imageData.startsWith("data:image/")) {
    throw new Error("Invalid image upload.");
  }

  await prisma.transformationPhoto.create({
    data: {
      userId: user.id,
      stage: String(formData.get("stage") ?? "Milestone"),
      imageData,
      caption: String(formData.get("caption") ?? "") || null,
      date: new Date(String(formData.get("date") ?? new Date().toISOString())),
      isPublic: formData.get("isPublic") === "on",
    },
  });

  await awardXp(user.id, 32);
  refreshPaths(["/progress"]);
}
