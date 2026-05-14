"use server";

import { refreshPaths, requireSessionUser } from "@/lib/action-helpers";
import { prisma } from "@/lib/db";

export async function updateProfileAction(formData: FormData) {
  const user = await requireSessionUser();
  const name = String(formData.get("name") ?? "");
  const bio = String(formData.get("bio") ?? "");
  const location = String(formData.get("location") ?? "");
  const currentWeightKg = Number(formData.get("currentWeightKg") ?? 0) || null;
  const targetWeightKg = Number(formData.get("targetWeightKg") ?? 0) || null;
  const dailyWaterGoalMl = Number(formData.get("dailyWaterGoalMl") ?? 0) || 3000;
  const dailyProteinGoal = Number(formData.get("dailyProteinGoal") ?? 0) || 140;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      bio,
      location,
      currentWeightKg,
      targetWeightKg,
      dailyWaterGoalMl,
      dailyProteinGoal,
    },
  });

  refreshPaths(["/settings", "/dashboard", "/progress"]);
}

export async function updatePreferencesAction(formData: FormData) {
  const user = await requireSessionUser();

  await prisma.userSettings.update({
    where: { userId: user.id },
    data: {
      workoutReminders: formData.get("workoutReminders") === "on",
      nutritionReminders: formData.get("nutritionReminders") === "on",
      challengeAlerts: formData.get("challengeAlerts") === "on",
      pushNotifications: formData.get("pushNotifications") === "on",
      emailNotifications: formData.get("emailNotifications") === "on",
      weeklyDigest: formData.get("weeklyDigest") === "on",
      publicProfile: formData.get("publicProfile") === "on",
      shareActivity: formData.get("shareActivity") === "on",
      showTransformation: formData.get("showTransformation") === "on",
      reducedMotion: formData.get("reducedMotion") === "on",
      soundEffects: formData.get("soundEffects") === "on",
    },
  });

  refreshPaths(["/settings"]);
}

export async function completeOnboardingAction(formData: FormData) {
  const user = await requireSessionUser();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      fitnessGoal: String(formData.get("fitnessGoal") ?? "WELLNESS") as never,
      fitnessLevel: String(formData.get("fitnessLevel") ?? "BEGINNER") as never,
      dailyWaterGoalMl: Number(formData.get("dailyWaterGoalMl") ?? 2800),
      dailyProteinGoal: Number(formData.get("dailyProteinGoal") ?? 130),
      onboardingCompleted: true,
    },
  });

  refreshPaths(["/dashboard", "/settings"]);
}
