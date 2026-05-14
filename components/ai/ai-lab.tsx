"use client";

import { Bot, Sparkles, WandSparkles } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveMealPlanAction } from "@/lib/actions/nutrition";

const prompts = {
  workout: "Build me a 35-minute lower-body strength session with dumbbells and minimal setup.",
  meals: "Create a high-protein Indian vegetarian meal plan for recomposition.",
  coach: "I have been inconsistent for two weeks and feel behind. Coach me back into rhythm.",
  recommendations: "Show the best next actions based on my current data.",
} as const;

export function AiLab() {
  const [mode, setMode] = useState<"workout" | "meals" | "coach" | "recommendations">("workout");
  const [prompt, setPrompt] = useState<string>(prompts.workout);
  const [response, setResponse] = useState("");
  const [loading, startTransition] = useTransition();

  const label = useMemo(() => {
    return mode === "workout"
      ? "Workout generator"
      : mode === "meals"
        ? "Meal planner"
        : mode === "coach"
          ? "Fitness chatbot"
          : "Smart recommendations";
  }, [mode]);

  async function runAi() {
    startTransition(async () => {
      const result = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt }),
      }).then((res) => res.json());

      setResponse(result.text);
      toast.success("AI response ready.");
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(61,137,255,0.18),rgba(20,217,166,0.18))]">
            <Bot className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted">AI lab</p>
            <h2 className="text-2xl font-semibold">{label}</h2>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {(["workout", "meals", "coach", "recommendations"] as const).map((tab) => (
            <Button
              key={tab}
              variant={mode === tab ? "primary" : "secondary"}
              onClick={() => {
                setMode(tab);
                setPrompt(prompts[tab]);
              }}
            >
              {tab === "recommendations" ? <Sparkles className="h-4 w-4" /> : null}
              {tab}
            </Button>
          ))}
        </div>

        <Textarea
          className="mt-6"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask for a workout, meal plan, or coaching guidance."
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={runAi} disabled={loading}>
            <WandSparkles className="h-4 w-4" />
            {loading ? "Thinking..." : "Generate"}
          </Button>
          <Button variant="ghost" onClick={() => setPrompt(prompts[mode])}>
            Reset prompt
          </Button>
        </div>
      </Card>

      <Card>
        <p className="text-sm text-muted">Response</p>
        <div className="mt-4 min-h-56 rounded-[1.5rem] bg-surface-soft p-5">
          <pre className="whitespace-pre-wrap font-body text-sm leading-7 text-foreground/92">
            {response || "Run a prompt to see your generated workout, meal plan, coach response, or recommendation stack."}
          </pre>
        </div>
      </Card>

      {mode === "meals" && response ? (
        <Card>
          <p className="text-sm text-muted">Save the draft</p>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              startTransition(async () => {
                await saveMealPlanAction(formData);
                toast.success("AI meal draft saved to Nutrition.");
                event.currentTarget.reset();
              });
            }}
          >
            <Input name="title" defaultValue="AI meal draft" />
            <input type="hidden" name="itemsSummary" value={response.slice(0, 900)} />
            <input type="hidden" name="mealType" value="DINNER" />
            <input type="hidden" name="date" value={new Date().toISOString().slice(0, 10)} />
            <div className="grid gap-4 md:grid-cols-4">
              <Input name="calories" defaultValue={550} type="number" />
              <Input name="protein" defaultValue={38} type="number" />
              <Input name="carbs" defaultValue={58} type="number" />
              <Input name="fat" defaultValue={18} type="number" />
            </div>
            <Input name="notes" defaultValue="Saved from AI Lab" />
            <input type="hidden" name="aiGenerated" value="true" />
            <Button type="submit" disabled={loading}>
              Save to meal plans
            </Button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
