import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel gradient-border relative overflow-hidden rounded-[1.75rem] p-6",
        className,
      )}
      {...props}
    />
  );
}
