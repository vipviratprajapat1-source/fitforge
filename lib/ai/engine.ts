import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

type AiMode = "workout" | "meals" | "coach" | "recommendations";

function workoutMock(prompt: string) {
  return `Here is a focused 4-part plan based on "${prompt}":

1. Primer: 5 min mobility flow + 2 light warm-up sets
2. Main block: Goblet squat 4x8, band row 4x12, incline push-up 4x10
3. Finisher: Mountain climber 4x30s, plank shoulder tap 3x20
4. Recovery: 6 min cooldown walk and nasal breathing

Progression tip: add one rep per set next session before increasing load.`;
}

function mealsMock(prompt: string) {
  return `AI meal draft for "${prompt}":

Breakfast: Masala oats with whey-stirred Greek yogurt
Lunch: Paneer tikka rice bowl with cucumber salad
Snack: Cold brew protein shake with roasted chana
Dinner: Rajma chawal, sauteed veggies, and dahi

Macro target: ~2,150 kcal | 145g protein | 240g carbs | 62g fat`;
}

function coachMock(prompt: string) {
  return `Coach note:

You do not need a perfect week. You need a repeatable next move. Based on "${prompt}", protect two anchors today: one protein-forward meal and one workout block you can finish in under 35 minutes. Momentum is built by making the next action obvious, not heroic.`;
}

function recommendationsMock() {
  return `Smart suggestions:

- Swap one all-or-nothing workout with a 28-minute momentum reset session.
- Front-load 35-40g protein in breakfast to make the day easier.
- Keep your rest timer at 75 seconds for upper body and 90 seconds for lower body.
- If your sleep dips below 7.5 hours, lower intensity before lowering consistency.`;
}

async function liveResponse(mode: AiMode, prompt: string, profile: string) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are Fitnity's premium fitness AI. Give concise, practical, safe, motivating fitness guidance with clear structure and realistic next steps.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Mode: ${mode}\nProfile: ${profile}\nRequest: ${prompt}`,
            },
          ],
        },
      ],
    }),
  });

  const data = (await response.json()) as { output_text?: string };
  return data.output_text ?? coachMock(prompt);
}

export async function generateAiResponse(mode: AiMode, prompt: string) {
  const session = await auth();
  const profile =
    session?.user?.id &&
    (await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        fitnessGoal: true,
        fitnessLevel: true,
        dailyProteinGoal: true,
        dailyWaterGoalMl: true,
      },
    }));

  const profileSummary = profile
    ? `${profile.name}; goal ${profile.fitnessGoal}; level ${profile.fitnessLevel}; protein ${profile.dailyProteinGoal}; water ${profile.dailyWaterGoalMl}`
    : "Guest profile";

  if (process.env.OPENAI_API_KEY) {
    return liveResponse(mode, prompt, profileSummary);
  }

  if (mode === "workout") {
    return workoutMock(prompt);
  }

  if (mode === "meals") {
    return mealsMock(prompt);
  }

  if (mode === "recommendations") {
    return recommendationsMock();
  }

  return coachMock(prompt);
}
