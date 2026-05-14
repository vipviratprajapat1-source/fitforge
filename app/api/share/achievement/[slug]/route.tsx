import { ImageResponse } from "next/og";

import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const achievement = await prisma.achievement.findUnique({
    where: { slug },
  });

  if (!achievement) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background:
            "radial-gradient(circle at top, rgba(110,168,255,0.42), transparent 30%), linear-gradient(145deg, #060916, #0c1630)",
          color: "#f5f9ff",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#90A2C2" }}>FITNITY ACHIEVEMENT</div>
        <div>
          <div style={{ fontSize: 76, fontWeight: 700 }}>{achievement.name}</div>
          <div style={{ marginTop: 18, fontSize: 30, color: "#B7C7DF", maxWidth: 900 }}>
            {achievement.description}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, color: "#22E4B7" }}>{achievement.xpReward} XP</div>
          <div style={{ fontSize: 24, color: "#90A2C2" }}>fitnity.app</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
