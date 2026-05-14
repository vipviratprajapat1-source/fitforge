"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LeaderboardChart } from "@/components/charts/fitness-charts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { joinChallengeAction, updateChallengeProgressAction } from "@/lib/actions/challenges";

type Challenge = {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  targetValue: number;
  isJoined: boolean;
  progress: number;
};

export function ChallengeArena({
  challenges,
  leaderboard,
}: {
  challenges: Challenge[];
  leaderboard: { name: string; xp: number }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <div className="space-y-5">
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <p className="text-sm text-muted">{challenge.rewardXp} XP reward</p>
            <h2 className="mt-2 text-2xl font-semibold">{challenge.title}</h2>
            <p className="mt-3 text-sm text-muted">{challenge.description}</p>
            <p className="mt-4 text-sm font-semibold text-accent">
              Current progress: {challenge.progress}/{challenge.targetValue}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {!challenge.isJoined ? (
                <Button
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await joinChallengeAction(challenge.id);
                      toast.success("Challenge joined.");
                      router.refresh();
                    })
                  }
                >
                  Join challenge
                </Button>
              ) : (
                <form
                  className="flex flex-col gap-3 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    startTransition(async () => {
                      await updateChallengeProgressAction(
                        challenge.id,
                        Number(formData.get("progress") ?? 0),
                      );
                      toast.success("Challenge progress updated.");
                      router.refresh();
                    });
                  }}
                >
                  <Input
                    name="progress"
                    type="number"
                    defaultValue={challenge.progress}
                    min={0}
                    max={challenge.targetValue}
                  />
                  <Button type="submit" disabled={pending}>
                    Update progress
                  </Button>
                </form>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <p className="text-sm text-muted">Leaderboard</p>
        <h2 className="mt-2 text-2xl font-semibold">XP ranking</h2>
        <LeaderboardChart data={leaderboard} />
      </Card>
    </div>
  );
}
