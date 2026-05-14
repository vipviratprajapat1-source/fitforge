import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-[1.5rem] border border-border bg-surface-soft px-4 py-3 text-sm text-foreground shadow-sm transition placeholder:text-muted/80 focus:border-accent focus:bg-surface focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
