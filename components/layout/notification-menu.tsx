"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions/ui";
import { formatRelativeDistance } from "@/lib/utils";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  link: string | null;
  createdAt: Date;
  readAt: Date | null;
};

export function NotificationMenu({
  notifications,
  unreadCount,
  userId,
}: {
  notifications: NotificationItem[];
  unreadCount: number;
  userId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-soft text-foreground transition hover:bg-surface"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-accent" />
        ) : null}
      </button>

      {open ? (
        <div className="glass-panel absolute right-0 top-14 z-50 w-[min(92vw,22rem)] rounded-[1.5rem] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Notifications</p>
              <p className="text-sm text-muted">{unreadCount} unread updates</p>
            </div>
            <button
              type="button"
              onClick={() =>
                startTransition(async () => {
                  await markAllNotificationsRead(userId);
                  router.refresh();
                })
              }
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {notifications.length ? (
              notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      await markNotificationRead(item.id);
                      setOpen(false);
                      router.refresh();

                      if (item.link) {
                        router.push(item.link);
                      }
                    })
                  }
                  className="w-full rounded-[1.25rem] border border-border/70 bg-surface-soft p-3 text-left transition hover:border-accent/40 hover:bg-surface"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.body}</p>
                    </div>
                    {item.readAt ? null : (
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                    )}
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted/90">
                    {formatRelativeDistance(item.createdAt)}
                  </p>
                </button>
              ))
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-border bg-surface-soft p-4 text-sm text-muted">
                All clear for now. Your streak and challenge updates will land here.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
