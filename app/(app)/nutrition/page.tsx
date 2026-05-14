import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NutritionStudio } from "@/components/nutrition/nutrition-studio";

export default async function NutritionPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const [user, metric, entries, mealPlans] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.dailyMetric.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.nutritionEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.mealPlan.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      take: 4,
    }),
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Nutrition system</p>
        <h1 className="mt-3 text-4xl font-semibold">Fuel, hydration, and meal planning in one flow.</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Log calories and macros, support Indian foods, save reusable meal plans, and keep
          hydration and sleep visible next to the nutrition data that shapes results.
        </p>
      </Card>

      <NutritionStudio
        entries={entries.map((entry) => ({
          ...entry,
          mealType: entry.mealType,
        }))}
        mealPlans={mealPlans.map((plan) => ({
          ...plan,
          date: plan.date.toISOString(),
        }))}
        waterGoal={user?.dailyWaterGoalMl ?? 3000}
        proteinGoal={user?.dailyProteinGoal ?? 140}
        waterMl={metric?.waterMl ?? 0}
        sleepHours={metric?.sleepHours ?? 0}
      />
    </div>
  );
}
