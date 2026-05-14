import { Flame, MoonStar, Sparkles, Trophy } from "lucide-react";

import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import {
  LeaderboardChart,
  MacroBreakdownChart,
  WeeklyActivityChart,
} from "@/components/charts/fitness-charts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, levelProgress, percentage } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const [user, metrics, entries, missions, achievements, leaderboard, challenges, routines] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { streak: true },
      }),
      prisma.dailyMetric.findMany({
        where: { userId },
        orderBy: { date: "asc" },
        take: 7,
      }),
      prisma.nutritionEntry.findMany({
        where: { userId },
      }),
      prisma.userMissionProgress.findMany({
        where: { userId },
        include: { mission: true },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
        take: 4,
      }),
      prisma.user.findMany({
        orderBy: [{ xp: "desc" }],
        take: 4,
        select: { name: true, xp: true },
      }),
      prisma.challengeEntry.findMany({
        where: { userId },
        include: { challenge: true },
        take: 3,
      }),
      prisma.workoutRoutine.findMany({
        where: { OR: [{ isTemplate: true }, { userId }] },
        orderBy: { updatedAt: "desc" },
        take: 3,
      }),
    ]);

  const latestMetric = metrics.at(-1);
  const todayEntries = entries.filter(
    (entry) => new Date(entry.date).toDateString() === new Date().toDateString(),
  );

  const protein = todayEntries.reduce((sum, item) => sum + item.protein, 0);
  const carbs = todayEntries.reduce((sum, item) => sum + item.carbs, 0);
  const fat = todayEntries.reduce((sum, item) => sum + item.fat, 0);
  const chartData = metrics.map((item) => ({
    day: formatDate(item.date, "EEE"),
    calories: item.caloriesBurned,
    steps: item.steps,
  }));

  return (
    <div className="space-y-6">
      <Card className="hero-glow">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Dashboard</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">
              Welcome back, {user?.name?.split(" ")[0] ?? "Athlete"}.
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted">
              Your stack is live: workouts, recovery, meals, XP, and challenge momentum
              are all synced into one operating rhythm.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-surface-soft p-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Sparkles className="h-4 w-4 text-accent" />
              Level {user?.level ?? 1}
            </div>
            <p className="mt-2 text-2xl font-semibold">{user?.xp ?? 0} XP banked</p>
            <Progress className="mt-3" value={levelProgress(user?.xp ?? 0)} />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-muted">Workout calories</p>
          <p className="mt-3 text-3xl font-semibold">{latestMetric?.caloriesBurned ?? 0}</p>
          <p className="mt-3 text-sm text-muted">Tracked across today’s movement.</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Current streak</p>
          <p className="mt-3 flex items-center gap-2 text-3xl font-semibold">
            <Flame className="h-7 w-7 text-accent-3" />
            {user?.streak?.current ?? 0} days
          </p>
          <p className="mt-3 text-sm text-muted">Best streak: {user?.streak?.best ?? 0} days.</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Hydration</p>
          <p className="mt-3 text-3xl font-semibold">
            {latestMetric?.waterMl ?? 0} / {user?.dailyWaterGoalMl ?? 0}ml
          </p>
          <Progress className="mt-3" value={percentage(latestMetric?.waterMl ?? 0, user?.dailyWaterGoalMl ?? 0)} tone="success" />
        </Card>
        <Card>
          <p className="text-sm text-muted">Sleep</p>
          <p className="mt-3 flex items-center gap-2 text-3xl font-semibold">
            <MoonStar className="h-7 w-7 text-accent-2" />
            {latestMetric?.sleepHours ?? 0}h
          </p>
          <p className="mt-3 text-sm text-muted">Goal: {user?.dailySleepGoalHours ?? 8}h nightly.</p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted">Weekly activity</p>
              <h2 className="mt-2 text-2xl font-semibold">Calories and movement trend</h2>
            </div>
            <Badge>Last 7 days</Badge>
          </div>
          <WeeklyActivityChart data={chartData} />
        </Card>

        <Card>
          <p className="text-sm text-muted">Macro balance today</p>
          <h2 className="mt-2 text-2xl font-semibold">Protein-first by design</h2>
          <MacroBreakdownChart
            data={[
              { name: "Protein", value: protein || 1 },
              { name: "Carbs", value: carbs || 1 },
              { name: "Fat", value: fat || 1 },
            ]}
          />
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Quick actions</p>
            <h2 className="mt-2 text-2xl font-semibold">Log the habits that keep the flywheel moving.</h2>
          </div>
          <Badge>Live controls</Badge>
        </div>
        <div className="mt-6">
          <DashboardActions />
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <p className="text-sm text-muted">Daily missions</p>
          <h2 className="mt-2 text-2xl font-semibold">Today’s XP board</h2>
          <div className="mt-5 space-y-4">
            {missions.map((mission) => (
              <div key={mission.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{mission.mission.title}</p>
                    <p className="mt-1 text-sm text-muted">{mission.mission.description}</p>
                  </div>
                  <p className="text-sm font-semibold text-accent">{mission.mission.xpReward} XP</p>
                </div>
                <Progress
                  className="mt-4"
                  value={percentage(mission.progress, mission.mission.targetValue)}
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Recent achievements</p>
                <h2 className="mt-2 text-2xl font-semibold">Momentum that compounds</h2>
              </div>
              <Trophy className="h-6 w-6 text-warning" />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {achievements.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                  <p className="font-semibold">{item.achievement.name}</p>
                  <p className="mt-2 text-sm text-muted">{item.achievement.description}</p>
                  <a
                    href={`/api/share/achievement/${item.achievement.slug}`}
                    target="_blank"
                    className="mt-4 inline-flex text-sm font-semibold text-accent"
                  >
                    Open share card
                  </a>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <Card>
              <p className="text-sm text-muted">Leaderboard</p>
              <h2 className="mt-2 text-2xl font-semibold">Top XP this week</h2>
              <LeaderboardChart
                data={leaderboard.map((item) => ({
                  name: item.name.split(" ")[0],
                  xp: item.xp,
                }))}
              />
            </Card>
            <Card>
              <p className="text-sm text-muted">Your active loops</p>
              <div className="mt-5 space-y-3">
                {challenges.map((item) => (
                  <div key={item.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                    <p className="font-semibold">{item.challenge.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {item.progress}/{item.challenge.targetValue} complete
                    </p>
                  </div>
                ))}
                {routines.map((item) => (
                  <div key={item.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {item.durationMinutes} minutes · {item.focusArea}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
