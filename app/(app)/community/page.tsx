import { Card } from "@/components/ui/card";
import { CommunityHub } from "@/components/social/community-hub";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function CommunityPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const [posts, users, follows] = await Promise.all([
    prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      take: 4,
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
      },
    }),
    prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    }),
  ]);

  const followingIds = new Set(follows.map((item) => item.followingId));

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Social features</p>
        <h1 className="mt-3 text-4xl font-semibold">Community pressure that feels supportive, not noisy.</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Follow users, share progress, like wins, comment on updates, and turn fitness into
          something social enough to keep going.
        </p>
      </Card>

      <CommunityHub
        currentUserId={userId}
        posts={posts}
        suggestions={users.map((user) => ({
          id: user.id,
          name: user.name,
          username: user.username,
          bio: user.bio,
          image: user.image,
          isFollowing: followingIds.has(user.id),
        }))}
      />
    </div>
  );
}
