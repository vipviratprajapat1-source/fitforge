import { Card } from "@/components/ui/card";
import { ProgressStudio } from "@/components/progress/progress-studio";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ProgressPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const [entries, photos, achievements] = await Promise.all([
    prisma.progressEntry.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    }),
    prisma.transformationPhoto.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Progress tracking</p>
        <h1 className="mt-3 text-4xl font-semibold">See the body, behavior, and momentum changes clearly.</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Measurements, before-and-after moments, progress charts, and share-ready achievement
          cards live in one timeline so effort becomes visible.
        </p>
      </Card>

      <ProgressStudio
        entries={entries.map((entry) => ({
          ...entry,
          date: entry.date.toISOString(),
        }))}
        photos={photos.map((photo) => ({
          ...photo,
          date: photo.date.toISOString(),
        }))}
        achievements={achievements.map((item) => ({
          id: item.id,
          slug: item.achievement.slug,
          name: item.achievement.name,
          description: item.achievement.description,
        }))}
      />
    </div>
  );
}
