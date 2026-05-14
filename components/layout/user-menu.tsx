"use client";

import { LogOut, Settings2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";

export function UserMenu({
  user,
}: {
  user: {
    name: string;
    email: string;
    image?: string | null;
    level: number;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-3 rounded-full border border-border bg-surface-soft px-2 py-1.5 transition hover:bg-surface"
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar name={user.name} image={user.image} className="h-10 w-10" />
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Level {user.level}</p>
        </div>
      </button>

      {open ? (
        <div className="glass-panel absolute right-0 top-14 z-50 w-64 rounded-[1.5rem] p-3">
          <div className="rounded-[1.25rem] bg-surface-soft p-3">
            <p className="font-semibold">{user.name}</p>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <div className="mt-3 space-y-2">
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-[1rem] px-3 py-2.5 text-sm font-semibold transition hover:bg-surface-soft"
              onClick={() => setOpen(false)}
            >
              <Settings2 className="h-4 w-4" />
              Account settings
            </Link>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left text-sm font-semibold text-danger transition hover:bg-surface-soft"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
