import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full appearance-none rounded-2xl border border-border bg-surface-soft px-4 text-sm text-foreground shadow-sm transition focus:border-accent focus:bg-surface focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
