import { NextResponse } from "next/server";

import { generateAiResponse } from "@/lib/ai/engine";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    mode: "workout" | "meals" | "coach" | "recommendations";
    prompt: string;
  };

  const text = await generateAiResponse(body.mode, body.prompt);
  return NextResponse.json({ text });
}
