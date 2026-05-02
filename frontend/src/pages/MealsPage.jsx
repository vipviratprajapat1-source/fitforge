import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppData } from "@/context/AppDataContext";

export default function MealsPage() {
  const { mealPlans } = useAppData();
  const [goal, setGoal] = useState("Fat loss");
  const [preference, setPreference] = useState("Vegetarian");
  const filtered = useMemo(
    () => mealPlans.filter((plan) => plan.goal === goal && plan.preference === preference),
    [mealPlans, goal, preference]
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Meal planner"
        title="Daily meal plans matched to your goal"
        description="Vegetarian and non-vegetarian templates with calories and protein totals for fat loss or muscle gain."
      />

      <div className="surface-card flex flex-wrap gap-3">
        <select className="input-field max-w-xs" value={goal} onChange={(event) => setGoal(event.target.value)}>
          <option>Fat loss</option>
          <option>Muscle gain</option>
        </select>
        <select
          className="input-field max-w-xs"
          value={preference}
          onChange={(event) => setPreference(event.target.value)}
        >
          <option>Vegetarian</option>
          <option>Non-vegetarian</option>
        </select>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((plan) => (
          <section key={plan.id} className="surface-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">{plan.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                  {plan.calories} calories · {plan.protein}g protein
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="chip">{plan.preference}</span>
                <span className="chip">{plan.goal}</span>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {plan.meals.map((meal) => (
                <div key={`${plan.id}-${meal.slot}`} className="rounded-[24px] border border-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{meal.slot}</p>
                      <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                        {meal.name}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p>{meal.calories} cal</p>
                      <p style={{ color: "rgb(var(--text-soft))" }}>{meal.protein}g protein</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

