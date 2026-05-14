import { ChallengeArena } from "@/components/challenges/challenge-arena";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ChallengesPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const [entries, allChallenges, leaderboard] = await Promise.all([
    prisma.challengeEntry.findMany({
      where: { userId },
      select: { challengeId: true, progress: true },
    }),
    prisma.challenge.findMany({
      orderBy: [{ isFeatured: "desc" }, { startsAt: "asc" }],
    }),
    prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: 5,
      select: { name: true, xp: true },
    }),
  ]);

  const entryMap = new Map(entries.map((entry) => [entry.challengeId, entry]));

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Gamification</p>
        <h1 className="mt-3 text-4xl font-semibold">Chase XP, badges, ranks, and streak rewards.</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Daily missions and longer community challenges create a real reason to return, finish,
          and keep pressure on the behaviors that matter.
        </p>
      </Card>

      <ChallengeArena
        challenges={allChallenges.map((challenge) => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          rewardXp: challenge.rewardXp,
          targetValue: challenge.targetValue,
          isJoined: entryMap.has(challenge.id),
          progress: entryMap.get(challenge.id)?.progress ?? 0,
        }))}
        leaderboard={leaderboard.map((user) => ({
          name: user.name.split(" ")[0],
          xp: user.xp,
        }))}
      />
    </div>
  );
}
