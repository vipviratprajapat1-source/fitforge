"use client";

import Image from "next/image";
import { Share2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ProgressTrendChart } from "@/components/charts/fitness-charts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProgressEntryAction, createTransformationPhotoAction } from "@/lib/actions/progress";

export function ProgressStudio({
  entries,
  photos,
  achievements,
}: {
  entries: {
    id: string;
    date: string;
    weightKg: number | null;
    waistCm: number | null;
    bodyFat: number | null;
    notes: string | null;
  }[];
  photos: {
    id: string;
    stage: string;
    imageData: string;
    caption: string | null;
    date: string;
  }[];
  achievements: {
    id: string;
    slug: string;
    name: string;
    description: string;
  }[];
}) {
  const [photoData, setPhotoData] = useState("");
  const [pending, startTransition] = useTransition();

  async function handleFile(file: File | null) {
    if (!file) {
      setPhotoData("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhotoData(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm text-muted">Progress trend</p>
        <ProgressTrendChart
          data={entries.map((entry) => ({
            date: new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            weight: Number(entry.weightKg ?? 0),
            waist: Number(entry.waistCm ?? 0),
          }))}
        />
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <p className="text-sm text-muted">Measurement tracking</p>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              startTransition(async () => {
                await createProgressEntryAction(formData);
                toast.success("Progress entry saved.");
                event.currentTarget.reset();
              });
            }}
          >
            <div className="grid gap-4 md:grid-cols-4">
              <Input name="date" type="date" />
              <Input name="weightKg" type="number" step="0.1" placeholder="Weight" />
              <Input name="bodyFat" type="number" step="0.1" placeholder="Body fat %" />
              <Input name="waistCm" type="number" step="0.1" placeholder="Waist cm" />
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Input name="chestCm" type="number" step="0.1" placeholder="Chest cm" />
              <Input name="hipsCm" type="number" step="0.1" placeholder="Hips cm" />
              <Input name="armsCm" type="number" step="0.1" placeholder="Arms cm" />
              <Input name="thighsCm" type="number" step="0.1" placeholder="Thighs cm" />
            </div>
            <Textarea name="notes" placeholder="How did your body and training feel?" />
            <Button type="submit" disabled={pending}>
              Save measurements
            </Button>
          </form>
        </Card>

        <Card>
          <p className="text-sm text-muted">Before / after gallery</p>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              formData.set("imageData", photoData);
              startTransition(async () => {
                await createTransformationPhotoAction(formData);
                toast.success("Transformation photo saved.");
                setPhotoData("");
                event.currentTarget.reset();
              });
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Select name="stage" defaultValue="Milestone">
                <option>Before</option>
                <option>After</option>
                <option>Milestone</option>
              </Select>
              <Input name="date" type="date" />
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
              required
            />
            <Textarea name="caption" placeholder="Caption" />
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" name="isPublic" defaultChecked className="h-4 w-4 accent-[var(--accent)]" />
              Share in public gallery
            </label>
            <Button type="submit" disabled={pending}>
              Upload milestone
            </Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="text-sm text-muted">Achievements</p>
          <div className="mt-5 space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                <p className="font-semibold">{achievement.name}</p>
                <p className="mt-1 text-sm text-muted">{achievement.description}</p>
                <a
                  href={`/api/share/achievement/${achievement.slug}`}
                  target="_blank"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent"
                >
                  <Share2 className="h-4 w-4" />
                  Open share card
                </a>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm text-muted">Transformation timeline</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {photos.map((photo) => (
              <div key={photo.id} className="rounded-[1.5rem] bg-surface-soft p-4">
                <Image
                  src={photo.imageData}
                  alt={photo.stage}
                  width={900}
                  height={1200}
                  unoptimized
                  className="h-72 w-full rounded-[1.25rem] object-cover"
                />
                <div className="mt-4">
                  <p className="font-semibold">
                    {photo.stage} · {new Date(photo.date).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-sm text-muted">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
