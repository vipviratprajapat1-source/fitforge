"use client";

import { Bell, Droplets, MoonStar, TimerReset } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logSleepAction, logWaterAction } from "@/lib/actions/nutrition";
import { useAppStore } from "@/lib/store";
import { MOTIVATION_QUOTES } from "@/lib/constants";

export function DashboardActions() {
  const [sleepHours, setSleepHours] = useState("7.8");
  const [isPending, startTransition] = useTransition();
  const [quote] = useState(
    () => MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)],
  );
  const { restActive, restSeconds, setRestActive, setRestSeconds } = useAppStore();

  useEffect(() => {
    if (!restActive || restSeconds <= 0) {
      if (restActive && restSeconds <= 0) {
        toast.success("Rest timer complete. Go get the next set.");

        if (Notification.permission === "granted") {
          new Notification("Fitnity", {
            body: "Rest timer complete. Time for the next set.",
          });
        }
      }
      return;
    }

    const timer = window.setTimeout(() => setRestSeconds(restSeconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [restActive, restSeconds, setRestSeconds]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[1.5rem] bg-surface-soft p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Quick logs</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[250, 500, 1000].map((amount) => (
            <Button
              key={amount}
              variant="secondary"
              onClick={() =>
                startTransition(async () => {
                  await logWaterAction(amount);
                  toast.success(`${amount}ml added.`);
                })
              }
              disabled={isPending}
            >
              <Droplets className="h-4 w-4" />
              +{amount}ml
            </Button>
          ))}
        </div>

        <form
          className="mt-5 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              await logSleepAction(Number(sleepHours));
              toast.success("Sleep log saved.");
            });
          }}
        >
          <Input
            value={sleepHours}
            onChange={(event) => setSleepHours(event.target.value)}
            type="number"
            min="0"
            max="12"
            step="0.1"
          />
          <Button type="submit" disabled={isPending}>
            <MoonStar className="h-4 w-4" />
            Save sleep
          </Button>
        </form>
      </div>

      <div className="rounded-[1.5rem] bg-surface-soft p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Rest timer</p>
          <TimerReset className="h-4 w-4 text-accent" />
        </div>
        <p className="mt-4 text-4xl font-semibold">
          {Math.floor(restSeconds / 60)
            .toString()
            .padStart(2, "0")}
          :
          {(restSeconds % 60).toString().padStart(2, "0")}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[45, 75, 90, 120].map((value) => (
            <Button key={value} variant="secondary" onClick={() => setRestSeconds(value)}>
              {value}s
            </Button>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => setRestActive(!restActive)}>
            {restActive ? "Pause timer" : "Start timer"}
          </Button>
          <Button variant="ghost" onClick={() => setRestSeconds(90)}>
            Reset
          </Button>
        </div>
        <p className="mt-5 text-sm text-muted">{quote}</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={async () => {
            if (!("Notification" in window)) {
              toast.error("Browser notifications are not supported here.");
              return;
            }
            const permission = await Notification.requestPermission();
            toast.success(
              permission === "granted"
                ? "Browser alerts enabled."
                : "Notifications permission was not granted.",
            );
          }}
        >
          <Bell className="h-4 w-4" />
          Enable browser alerts
        </Button>
      </div>
    </div>
  );
}
