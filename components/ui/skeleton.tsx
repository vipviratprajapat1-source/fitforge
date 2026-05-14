import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-[linear-gradient(90deg,rgba(127,144,178,0.12),rgba(127,144,178,0.24),rgba(127,144,178,0.12))] bg-[length:220%_100%]",
        className,
      )}
    />
  );
}
