"use client";

import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { InstallAppButton } from "@/components/layout/install-app-button";
import { Logo } from "@/components/layout/logo";
import { NotificationMenu } from "@/components/layout/notification-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

type ShellProps = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    level: number;
    xp: number;
  };
  notifications: {
    id: string;
    title: string;
    body: string;
    link: string | null;
    createdAt: Date;
    readAt: Date | null;
  }[];
  unreadCount: number;
  children: React.ReactNode;
};

export function AppShell({ children, notifications, unreadCount, user }: ShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="space-y-2">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition",
              active
                ? "bg-[linear-gradient(135deg,rgba(61,137,255,0.16),rgba(20,217,166,0.12))] text-foreground"
                : "text-muted hover:bg-surface-soft hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen">
      <div className="page-shell grid min-h-screen gap-6 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-6">
        <aside className="glass-panel hidden rounded-[2rem] p-5 lg:flex lg:flex-col">
          <Logo href="/dashboard" />
          <div className="mt-8">{nav}</div>
          <div className="mt-auto rounded-[1.75rem] bg-[linear-gradient(145deg,rgba(61,137,255,0.16),rgba(20,217,166,0.12),rgba(255,142,79,0.16))] p-4">
            <Badge className="bg-white/10 text-foreground dark:bg-white/5">XP Engine</Badge>
            <p className="mt-3 text-lg font-semibold">Level {user.level}</p>
            <p className="mt-1 text-sm text-muted">{user.xp} XP banked. Keep momentum high.</p>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="glass-panel sticky top-4 z-40 flex items-center justify-between rounded-[1.75rem] px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-soft lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Today’s Focus</p>
                <div className="mt-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <p className="text-sm font-semibold">Protect the streak and log one win.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <InstallAppButton />
              <ThemeToggle />
              <NotificationMenu
                notifications={notifications}
                unreadCount={unreadCount}
                userId={user.id}
              />
              <UserMenu user={user} />
            </div>
          </header>

          <main className="py-6">{children}</main>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/55 p-4 lg:hidden">
          <aside className="glass-panel h-full max-w-xs rounded-[2rem] p-5">
            <div className="flex items-center justify-between">
              <Logo href="/dashboard" />
              <button
                type="button"
                className="rounded-full border border-border bg-surface-soft px-3 py-2 text-sm font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-8">{nav}</div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
