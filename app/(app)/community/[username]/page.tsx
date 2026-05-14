import Image from "next/image";
import { notFound } from "next/navigation";

import { FollowProfileButton } from "@/components/social/follow-profile-button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function CommunityProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();
  const currentUserId = session?.user?.id ?? "";

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 6,
      },
      achievements: {
        include: { achievement: true },
        take: 4,
      },
      followers: true,
      following: true,
    },
  });

  if (!user || !user.isPublic) {
    notFound();
  }

  const isFollowing = user.followers.some((entry) => entry.followerId === currentUserId);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} image={user.image} className="h-16 w-16" />
            <div>
              <h1 className="text-4xl font-semibold">{user.name}</h1>
              <p className="mt-2 text-sm text-muted">@{user.username}</p>
              <p className="mt-3 max-w-2xl text-sm text-muted">{user.bio}</p>
            </div>
          </div>
          {currentUserId && currentUserId !== user.id ? (
            <FollowProfileButton targetUserId={user.id} isFollowing={isFollowing} />
          ) : null}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.5rem] bg-surface-soft p-4">
            <p className="text-sm text-muted">Level</p>
            <p className="mt-2 text-3xl font-semibold">{user.level}</p>
          </div>
          <div className="rounded-[1.5rem] bg-surface-soft p-4">
            <p className="text-sm text-muted">XP</p>
            <p className="mt-2 text-3xl font-semibold">{user.xp}</p>
          </div>
          <div className="rounded-[1.5rem] bg-surface-soft p-4">
            <p className="text-sm text-muted">Followers</p>
            <p className="mt-2 text-3xl font-semibold">{user.followers.length}</p>
          </div>
          <div className="rounded-[1.5rem] bg-surface-soft p-4">
            <p className="text-sm text-muted">Following</p>
            <p className="mt-2 text-3xl font-semibold">{user.following.length}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <p className="text-sm text-muted">Recent posts</p>
          <div className="mt-5 space-y-4">
            {user.posts.map((post) => (
              <div key={post.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                <p className="text-base">{post.content}</p>
                {post.imageData ? (
                  <Image
                    src={post.imageData}
                    alt="Post visual"
                    width={1200}
                    height={800}
                    unoptimized
                    className="mt-4 max-h-72 w-full rounded-[1.25rem] object-cover"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm text-muted">Achievements</p>
          <div className="mt-5 space-y-3">
            {user.achievements.map((item) => (
              <div key={item.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                <p className="font-semibold">{item.achievement.name}</p>
                <p className="mt-1 text-sm text-muted">{item.achievement.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
