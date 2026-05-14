"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { toggleFollowAction } from "@/lib/actions/social";

export function FollowProfileButton({
  targetUserId,
  isFollowing,
}: {
  targetUserId: string;
  isFollowing: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant={isFollowing ? "secondary" : "primary"}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleFollowAction(targetUserId);
          toast.success(isFollowing ? "Unfollowed." : "Following now.");
          router.refresh();
        })
      }
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
