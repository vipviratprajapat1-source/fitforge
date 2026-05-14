import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  tone = "accent",
}: {
  value: number;
  className?: string;
  tone?: "accent" | "success" | "warning";
}) {
  const barTone =
    tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-accent";

  return (
    <div className={cn("h-2.5 overflow-hidden rounded-full bg-surface-soft", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", barTone)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
