import { AiLab } from "@/components/ai/ai-lab";
import { Card } from "@/components/ui/card";

export default function AiPage() {
  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm uppercase tracking-[0.24em] text-muted">AI features</p>
        <h1 className="mt-3 text-4xl font-semibold">Generate smarter workouts, meals, and coaching cues.</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          The AI layer is fully wired. If no API key is present it returns thoughtful local
          mock responses, and if an OpenAI key is configured it upgrades to live generated guidance.
        </p>
      </Card>
      <AiLab />
    </div>
  );
}
