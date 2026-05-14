"use server";

import { prisma } from "@/lib/db";
import {
  awardXp,
  evaluateAchievements,
  syncDailyMissionProgress,
  touchStreak,
} from "@/lib/gamification";
import { refreshPaths, requireSessionUser, todayDate } from "@/lib/action-helpers";

export async function createNutritionEntryAction(formData: FormData) {
  const user = await requireSessionUser();
  const date = todayDate();
  const calories = Number(formData.get("calories") ?? 0);
  const protein = Number(formData.get("protein") ?? 0);

  await prisma.nutritionEntry.create({
    data: {
      userId: user.id,
      date,
      mealType: String(formData.get("mealType") ?? "BREAKFAST") as never,
      name: String(formData.get("name") ?? ""),
      calories,
      protein,
      carbs: Number(formData.get("carbs") ?? 0),
      fat: Number(formData.get("fat") ?? 0),
      fiber: Number(formData.get("fiber") ?? 0) || null,
      quantity: Number(formData.get("quantity") ?? 1),
      unit: String(formData.get("unit") ?? "serving"),
      barcode: String(formData.get("barcode") ?? "") || null,
      isIndianFood: formData.get("isIndianFood") === "on",
    },
  });

  await prisma.dailyMetric.upsert({
    where: {
      userId_date: { userId: user.id, date },
    },
    update: {
      caloriesConsumed: {
        increment: calories,
      },
    },
    create: {
      userId: user.id,
      date,
      caloriesConsumed: calories,
    },
  });

  await touchStreak(user.id);
  await awardXp(user.id, 22);
  await syncDailyMissionProgress(user.id);
  await evaluateAchievements(user.id);
  refreshPaths(["/nutrition", "/dashboard"]);
}

export async function logWaterAction(amountMl: number) {
  const user = await requireSessionUser();
  const date = todayDate();

  await prisma.dailyMetric.upsert({
    where: {
      userId_date: { userId: user.id, date },
    },
    update: {
      waterMl: {
        increment: amountMl,
      },
    },
    create: {
      userId: user.id,
      date,
      waterMl: amountMl,
    },
  });

  await touchStreak(user.id);
  await awardXp(user.id, 12);
  await syncDailyMissionProgress(user.id);
  await evaluateAchievements(user.id);
  refreshPaths(["/dashboard", "/nutrition"]);
}

export async function logSleepAction(hours: number) {
  const user = await requireSessionUser();
  const date = todayDate();

  await prisma.dailyMetric.upsert({
    where: {
      userId_date: { userId: user.id, date },
    },
    update: {
      sleepHours: hours,
    },
    create: {
      userId: user.id,
      date,
      sleepHours: hours,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      type: "SLEEP",
      title: `Logged ${hours} hours of sleep`,
      date,
      sleepHours: hours,
      xpEarned: 18,
    },
  });

  await touchStreak(user.id);
  await awardXp(user.id, 18);
  await syncDailyMissionProgress(user.id);
  refreshPaths(["/dashboard", "/nutrition"]);
}

export async function saveMealPlanAction(formData: FormData) {
  const user = await requireSessionUser();

  await prisma.mealPlan.create({
    data: {
      userId: user.id,
      title: String(formData.get("title") ?? ""),
      mealType: String(formData.get("mealType") ?? "LUNCH") as never,
      date: new Date(String(formData.get("date") ?? new Date().toISOString())),
      itemsSummary: String(formData.get("itemsSummary") ?? ""),
      calories: Number(formData.get("calories") ?? 0),
      protein: Number(formData.get("protein") ?? 0),
      carbs: Number(formData.get("carbs") ?? 0),
      fat: Number(formData.get("fat") ?? 0),
      notes: String(formData.get("notes") ?? "") || null,
      aiGenerated: formData.get("aiGenerated") === "true",
    },
  });

  await awardXp(user.id, 28);
  refreshPaths(["/nutrition", "/ai"]);
}
