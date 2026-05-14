import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6ea8ff,#22e4b7,#ff9d60)] text-lg font-black text-white shadow-[0_16px_30px_rgba(61,137,255,0.28)]">
        F
      </div>
      <div>
        <p className="font-display text-lg font-bold tracking-tight">{APP_NAME}</p>
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Fitness OS</p>
      </div>
    </Link>
  );
}
