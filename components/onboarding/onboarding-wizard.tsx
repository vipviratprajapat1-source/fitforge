"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { completeOnboardingAction } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const steps = [
  "Choose your goal",
  "Pick your training level",
  "Set your daily targets",
];

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    fitnessGoal: "RECOMPOSITION",
    fitnessLevel: "INTERMEDIATE",
    dailyWaterGoalMl: "3000",
    dailyProteinGoal: "145",
  });

  const progress = useMemo(
    () => `${Math.round(((currentStep + 1) / steps.length) * 100)}%`,
    [currentStep],
  );

  return (
    <Card className="max-w-3xl p-8">
      <p className="text-sm uppercase tracking-[0.24em] text-muted">Welcome tutorial</p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold">Let’s calibrate your momentum.</h1>
        <p className="text-sm font-semibold text-accent">{progress}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              index === currentStep ? "bg-accent text-white" : "bg-surface-soft text-muted"
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-5">
        {currentStep === 0 ? (
          <Select
            value={form.fitnessGoal}
            onChange={(event) => setForm((prev) => ({ ...prev, fitnessGoal: event.target.value }))}
          >
            <option value="FAT_LOSS">Fat loss</option>
            <option value="MUSCLE_GAIN">Muscle gain</option>
            <option value="RECOMPOSITION">Recomposition</option>
            <option value="ENDURANCE">Endurance</option>
            <option value="WELLNESS">Wellness</option>
          </Select>
        ) : null}

        {currentStep === 1 ? (
          <Select
            value={form.fitnessLevel}
            onChange={(event) => setForm((prev) => ({ ...prev, fitnessLevel: event.target.value }))}
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </Select>
        ) : null}

        {currentStep === 2 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={form.dailyWaterGoalMl}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, dailyWaterGoalMl: event.target.value }))
              }
              type="number"
              placeholder="Daily water goal (ml)"
            />
            <Input
              value={form.dailyProteinGoal}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, dailyProteinGoal: event.target.value }))
              }
              type="number"
              placeholder="Daily protein goal (g)"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep((value) => Math.max(0, value - 1))}
          disabled={currentStep === 0 || pending}
        >
          Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={() => setCurrentStep((value) => value + 1)}>Continue</Button>
        ) : (
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const formData = new FormData();
                formData.set("fitnessGoal", form.fitnessGoal);
                formData.set("fitnessLevel", form.fitnessLevel);
                formData.set("dailyWaterGoalMl", form.dailyWaterGoalMl);
                formData.set("dailyProteinGoal", form.dailyProteinGoal);
                await completeOnboardingAction(formData);
                toast.success("Onboarding complete.");
                router.push("/dashboard");
                router.refresh();
              })
            }
          >
            {pending ? "Saving..." : "Finish onboarding"}
          </Button>
        )}
      </div>
    </Card>
  );
}
