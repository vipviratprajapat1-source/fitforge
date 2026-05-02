import { useState } from "react";
import { LeaderboardColumns } from "@/components/LeaderboardColumns";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppData } from "@/context/AppDataContext";

export default function SocialPage() {
  const { user, leaderboards, friends, challenges, searchFriends, searchResults, addFriend, createChallenge } =
    useAppData();
  const [query, setQuery] = useState("");
  const [challengeDraft, setChallengeDraft] = useState({
    friendId: "",
    title: "Weekly consistency duel",
    metric: "totalWorkouts",
    target: 5,
  });

  const shareProgress = async () => {
    const message = `${user.name} is on a ${user.stats.streak}-day FitForge streak with ${user.stats.totalWorkouts} total workouts and level ${user.stats.level}.`;
    if (navigator.share) {
      await navigator.share({ title: "FitForge progress", text: message });
      return;
    }
    await navigator.clipboard.writeText(message);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Leaderboards and friends"
        title="Separate ladders for every level"
        description="Beginner, Intermediate, Pro, and Max rankings are never mixed. Compete fairly on streaks and total workouts."
      />

      <LeaderboardColumns leaderboards={leaderboards} />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="surface-card">
          <SectionHeader
            eyebrow="Friends system"
            title="Find and compare"
            description="Add friends, compare streaks, and see who is building the stronger habit."
          />
          <div className="flex gap-3">
            <input
              className="input-field"
              placeholder="Search by name or username"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="button" className="button-secondary" onClick={() => searchFriends(query)}>
              Search
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {searchResults.map((result) => (
              <div key={result.id || result.username} className="rounded-[24px] border border-white/10 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{result.name}</p>
                    <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                      @{result.username} · {result.profile?.fitnessLevel}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => addFriend(result.id || result.username)}
                  >
                    Add friend
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Share progress</p>
              <button type="button" className="button-secondary" onClick={shareProgress}>
                Share
              </button>
            </div>
            <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              Share your streak and total workouts through the native share sheet or clipboard.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Current friends</h3>
            <div className="mt-4 space-y-3">
              {friends.length ? (
                friends.map((friend) => (
                  <div key={friend.id || friend.username} className="rounded-[24px] border border-white/10 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">{friend.name}</p>
                        <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                          @{friend.username} · {friend.profile?.fitnessLevel}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p>{friend.stats?.streak || 0} day streak</p>
                        <p style={{ color: "rgb(var(--text-soft))" }}>
                          {friend.stats?.totalWorkouts || 0} total workouts
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-white/10 p-4 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                  Add friends to compare progress here.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="surface-card">
          <SectionHeader
            eyebrow="Challenge system"
            title="Compete with friends"
            description="Create streak or total workout challenges and compare live values."
          />
          <div className="grid gap-3 md:grid-cols-2">
            <select
              className="input-field"
              value={challengeDraft.friendId}
              onChange={(event) => setChallengeDraft((current) => ({ ...current, friendId: event.target.value }))}
            >
              <option value="">Select friend</option>
              {friends.map((friend) => (
                <option key={friend.id || friend.username} value={friend.id || friend.username}>
                  {friend.name}
                </option>
              ))}
            </select>
            <input
              className="input-field"
              value={challengeDraft.title}
              onChange={(event) => setChallengeDraft((current) => ({ ...current, title: event.target.value }))}
            />
            <select
              className="input-field"
              value={challengeDraft.metric}
              onChange={(event) => setChallengeDraft((current) => ({ ...current, metric: event.target.value }))}
            >
              <option value="totalWorkouts">Total workouts</option>
              <option value="streak">Streak</option>
            </select>
            <input
              className="input-field"
              type="number"
              min="1"
              value={challengeDraft.target}
              onChange={(event) => setChallengeDraft((current) => ({ ...current, target: Number(event.target.value) }))}
            />
          </div>
          <button
            type="button"
            className="button-primary mt-4"
            onClick={() => createChallenge(challengeDraft)}
            disabled={!challengeDraft.friendId}
          >
            Create challenge
          </button>

          <div className="mt-6 space-y-3">
            {challenges.length ? (
              challenges.map((challenge) => (
                <div key={challenge.id} className="rounded-[24px] border border-white/10 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{challenge.title}</p>
                      <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                        vs {challenge.friendName} · Target {challenge.target} {challenge.metric}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p>You: {challenge.yourMetricValue}</p>
                      <p style={{ color: "rgb(var(--text-soft))" }}>
                        Friend: {challenge.friendMetricValue}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 p-4 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                No active challenges yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
