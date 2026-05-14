import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-border bg-surface-soft px-4 text-sm text-foreground shadow-sm transition placeholder:text-muted/80 focus:border-accent focus:bg-surface focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
