"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, UserPlus2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createCommentAction, createPostAction, toggleFollowAction, toggleLikeAction } from "@/lib/actions/social";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";

type Post = {
  id: string;
  content: string;
  mood: string | null;
  imageData: string | null;
  likesCount: number;
  commentsCount: number;
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  likes: { userId: string }[];
  comments: {
    id: string;
    content: string;
    user: { name: string };
  }[];
};

type Suggestion = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  image: string | null;
  isFollowing: boolean;
};

export function CommunityHub({
  currentUserId,
  posts,
  suggestions,
}: {
  currentUserId: string;
  posts: Post[];
  suggestions: Suggestion[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [imageData, setImageData] = useState("");

  async function handleFile(file: File | null) {
    if (!file) {
      setImageData("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageData(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <div className="space-y-6">
        <Card>
          <p className="text-sm text-muted">Create a post</p>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              formData.set("imageData", imageData);
              startTransition(async () => {
                await createPostAction(formData);
                setImageData("");
                toast.success("Post published.");
                event.currentTarget.reset();
                router.refresh();
              });
            }}
          >
            <Textarea name="content" placeholder="Share a win, setback, lesson, or challenge update..." />
            <div className="grid gap-4 md:grid-cols-[0.5fr_0.5fr_1fr]">
              <Select name="mood" defaultValue="Motivated">
                <option>Motivated</option>
                <option>Focused</option>
                <option>Calm</option>
                <option>Recovering</option>
              </Select>
              <Input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} />
              <Button type="submit" disabled={pending}>
                Share post
              </Button>
            </div>
          </form>
        </Card>

        {posts.map((post) => {
          const liked = post.likes.some((like) => like.userId === currentUserId);

          return (
            <Card key={post.id}>
              <div className="flex items-center gap-3">
                <Avatar name={post.user.name} image={post.user.image} />
                <div>
                  <Link href={`/community/${post.user.username}`} className="font-semibold">
                    {post.user.name}
                  </Link>
                  <p className="text-sm text-muted">@{post.user.username}</p>
                </div>
              </div>
              <p className="mt-5 text-base">{post.content}</p>
              {post.imageData ? (
                <Image
                  src={post.imageData}
                  alt="Post visual"
                  width={1200}
                  height={800}
                  unoptimized
                  className="mt-5 max-h-80 w-full rounded-[1.5rem] object-cover"
                />
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  variant={liked ? "primary" : "secondary"}
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await toggleLikeAction(post.id);
                      router.refresh();
                    })
                  }
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  {post.likesCount}
                </Button>
              </div>
              <div className="mt-5 space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="rounded-[1.25rem] bg-surface-soft p-3">
                    <p className="text-sm font-semibold">{comment.user.name}</p>
                    <p className="mt-1 text-sm text-muted">{comment.content}</p>
                  </div>
                ))}
              </div>
              <form
                className="mt-4 flex gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  startTransition(async () => {
                    await createCommentAction(formData);
                    toast.success("Comment posted.");
                    event.currentTarget.reset();
                    router.refresh();
                  });
                }}
              >
                <input type="hidden" name="postId" value={post.id} />
                <Input name="content" placeholder="Add a comment" />
                <Button type="submit" variant="secondary" disabled={pending}>
                  <MessageCircle className="h-4 w-4" />
                  Reply
                </Button>
              </form>
            </Card>
          );
        })}
      </div>

      <div className="space-y-6">
        <Card>
          <p className="text-sm text-muted">People to follow</p>
          <div className="mt-5 space-y-4">
            {suggestions.map((user) => (
              <div key={user.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} image={user.image} />
                  <div>
                    <Link href={`/community/${user.username}`} className="font-semibold">
                      {user.name}
                    </Link>
                    <p className="text-sm text-muted">@{user.username}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted">{user.bio}</p>
                <Button
                  className="mt-4"
                  variant={user.isFollowing ? "secondary" : "primary"}
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await toggleFollowAction(user.id);
                      toast.success(user.isFollowing ? "Unfollowed." : "Following now.");
                      router.refresh();
                    })
                  }
                >
                  <UserPlus2 className="h-4 w-4" />
                  {user.isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
