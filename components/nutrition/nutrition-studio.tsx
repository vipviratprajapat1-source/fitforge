"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { MacroBreakdownChart } from "@/components/charts/fitness-charts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { createNutritionEntryAction, logSleepAction, logWaterAction, saveMealPlanAction } from "@/lib/actions/nutrition";
import { percentage } from "@/lib/utils";

const indianFoods = [
  { name: "Paneer tikka bowl", calories: 520, protein: 32, carbs: 40, fat: 21 },
  { name: "Rajma chawal", calories: 570, protein: 22, carbs: 84, fat: 14 },
  { name: "Masala oats", calories: 410, protein: 24, carbs: 48, fat: 12 },
  { name: "Idli sambar", calories: 320, protein: 14, carbs: 49, fat: 7 },
];

export function NutritionStudio({
  entries,
  mealPlans,
  waterGoal,
  proteinGoal,
  waterMl,
  sleepHours,
}: {
  entries: {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: string;
    isIndianFood: boolean;
  }[];
  mealPlans: {
    id: string;
    title: string;
    itemsSummary: string;
    calories: number;
    protein: number;
    date: string;
  }[];
  waterGoal: number;
  proteinGoal: number;
  waterMl: number;
  sleepHours: number;
}) {
  const [pending, startTransition] = useTransition();
  const [selectedPreset, setSelectedPreset] = useState(indianFoods[0]);
  const totals = useMemo(
    () =>
      entries.reduce(
        (acc, entry) => {
          acc.calories += entry.calories;
          acc.protein += entry.protein;
          acc.carbs += entry.carbs;
          acc.fat += entry.fat;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [entries],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <p className="text-sm text-muted">Today’s nutrition</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-surface-soft p-4">
              <p className="text-sm text-muted">Water</p>
              <p className="mt-2 text-3xl font-semibold">{waterMl}ml</p>
              <Progress className="mt-3" value={percentage(waterMl, waterGoal)} tone="success" />
            </div>
            <div className="rounded-[1.5rem] bg-surface-soft p-4">
              <p className="text-sm text-muted">Sleep logged</p>
              <p className="mt-2 text-3xl font-semibold">{sleepHours}h</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {[250, 500, 1000].map((amount) => (
              <Button
                key={amount}
                variant="secondary"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await logWaterAction(amount);
                    toast.success(`${amount}ml added.`);
                  })
                }
              >
                +{amount}ml
              </Button>
            ))}
            <Button
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await logSleepAction(Math.max(7.5, sleepHours || 7.5));
                  toast.success("Sleep refreshed.");
                })
              }
            >
              Log recovery sleep
            </Button>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-muted">Macro breakdown</p>
          <h2 className="mt-2 text-2xl font-semibold">Fueling snapshot</h2>
          <MacroBreakdownChart
            data={[
              { name: "Protein", value: totals.protein || 1 },
              { name: "Carbs", value: totals.carbs || 1 },
              { name: "Fat", value: totals.fat || 1 },
            ]}
          />
          <p className="mt-2 text-sm text-muted">
            Protein progress: {Math.round(totals.protein)}/{proteinGoal}g
          </p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.92fr]">
        <Card>
          <p className="text-sm text-muted">Log food</p>
          <h2 className="mt-2 text-2xl font-semibold">Track calories, macros, and Indian staples</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {indianFoods.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setSelectedPreset(preset)}
                className="rounded-full border border-border bg-surface-soft px-4 py-2 text-sm font-semibold"
              >
                {preset.name}
              </button>
            ))}
          </div>

          <form
            key={selectedPreset.name}
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              startTransition(async () => {
                await createNutritionEntryAction(formData);
                toast.success("Nutrition entry saved.");
                event.currentTarget.reset();
              });
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="name" defaultValue={selectedPreset.name} placeholder="Food name" />
              <Select name="mealType" defaultValue="LUNCH">
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
                <option value="SNACK">Snack</option>
                <option value="PRE_WORKOUT">Pre-workout</option>
                <option value="POST_WORKOUT">Post-workout</option>
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Input name="calories" defaultValue={selectedPreset.calories} type="number" />
              <Input name="protein" defaultValue={selectedPreset.protein} type="number" />
              <Input name="carbs" defaultValue={selectedPreset.carbs} type="number" />
              <Input name="fat" defaultValue={selectedPreset.fat} type="number" />
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Input name="fiber" defaultValue={6} type="number" placeholder="Fiber" />
              <Input name="quantity" defaultValue={1} type="number" placeholder="Quantity" />
              <Input name="unit" defaultValue="serving" placeholder="Unit" />
              <Input name="barcode" placeholder="Barcode (optional)" />
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" name="isIndianFood" defaultChecked className="h-4 w-4 accent-[var(--accent)]" />
              Mark as Indian food
            </label>
            <Button type="submit" disabled={pending}>
              Save entry
            </Button>
          </form>
        </Card>

        <Card>
          <p className="text-sm text-muted">Meal plans</p>
          <h2 className="mt-2 text-2xl font-semibold">Save reusable plans</h2>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              startTransition(async () => {
                await saveMealPlanAction(formData);
                toast.success("Meal plan saved.");
                event.currentTarget.reset();
              });
            }}
          >
            <Input name="title" placeholder="Plan title" />
            <Input name="itemsSummary" placeholder="Items summary separated by |" />
            <div className="grid gap-4 md:grid-cols-2">
              <Select name="mealType" defaultValue="DINNER">
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
                <option value="SNACK">Snack</option>
              </Select>
              <Input name="date" type="date" />
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Input name="calories" type="number" placeholder="Calories" />
              <Input name="protein" type="number" placeholder="Protein" />
              <Input name="carbs" type="number" placeholder="Carbs" />
              <Input name="fat" type="number" placeholder="Fat" />
            </div>
            <Input name="notes" placeholder="Notes" />
            <Button type="submit" disabled={pending}>
              Save plan
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            {mealPlans.map((plan) => (
              <div key={plan.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                <p className="font-semibold">{plan.title}</p>
                <p className="mt-1 text-sm text-muted">{plan.itemsSummary}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted">
                  {plan.calories} kcal · {Math.round(plan.protein)}g protein
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-sm text-muted">Food log</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-[1.5rem] bg-surface-soft p-4">
              <p className="font-semibold">{entry.name}</p>
              <p className="mt-1 text-sm text-muted">
                {entry.mealType.toLowerCase().replace("_", " ")}
                {entry.isIndianFood ? " · Indian food" : ""}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-muted">
                {entry.calories} kcal · {Math.round(entry.protein)}p · {Math.round(entry.carbs)}c · {Math.round(entry.fat)}f
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
