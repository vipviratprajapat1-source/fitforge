import { FormSubmit } from "@/components/ui/form-submit";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updatePreferencesAction, updateProfileAction } from "@/lib/actions/settings";

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[1.25rem] bg-surface-soft px-4 py-3">
      <span className="text-sm font-semibold">{label}</span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-5 w-5 accent-[var(--accent)]"
      />
    </label>
  );
}

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id ?? "" },
    include: { settings: true },
  });

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Settings</p>
        <h1 className="mt-3 text-4xl font-semibold">Make the experience yours.</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Profile, privacy, alerts, and account behavior all live here.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <p className="text-sm text-muted">Profile</p>
          <h2 className="mt-2 text-2xl font-semibold">Update your personal metrics</h2>
          <form action={updateProfileAction} className="mt-6 space-y-4">
            <Input name="name" defaultValue={user?.name ?? ""} placeholder="Full name" />
            <Textarea name="bio" defaultValue={user?.bio ?? ""} placeholder="Short bio" />
            <Input name="location" defaultValue={user?.location ?? ""} placeholder="Location" />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                name="currentWeightKg"
                defaultValue={user?.currentWeightKg ?? undefined}
                placeholder="Current weight (kg)"
                type="number"
                step="0.1"
              />
              <Input
                name="targetWeightKg"
                defaultValue={user?.targetWeightKg ?? undefined}
                placeholder="Target weight (kg)"
                type="number"
                step="0.1"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                name="dailyWaterGoalMl"
                defaultValue={user?.dailyWaterGoalMl ?? 3000}
                placeholder="Daily water goal"
                type="number"
              />
              <Input
                name="dailyProteinGoal"
                defaultValue={user?.dailyProteinGoal ?? 140}
                placeholder="Daily protein goal"
                type="number"
              />
            </div>
            <FormSubmit pendingLabel="Saving profile...">Save profile</FormSubmit>
          </form>
        </Card>

        <Card>
          <p className="text-sm text-muted">Preferences</p>
          <h2 className="mt-2 text-2xl font-semibold">Notifications and privacy</h2>
          <form action={updatePreferencesAction} className="mt-6 space-y-3">
            <Checkbox
              name="workoutReminders"
              label="Workout reminders"
              defaultChecked={user?.settings?.workoutReminders ?? true}
            />
            <Checkbox
              name="nutritionReminders"
              label="Nutrition reminders"
              defaultChecked={user?.settings?.nutritionReminders ?? true}
            />
            <Checkbox
              name="challengeAlerts"
              label="Challenge alerts"
              defaultChecked={user?.settings?.challengeAlerts ?? true}
            />
            <Checkbox
              name="pushNotifications"
              label="Push notifications"
              defaultChecked={user?.settings?.pushNotifications ?? true}
            />
            <Checkbox
              name="emailNotifications"
              label="Email notifications"
              defaultChecked={user?.settings?.emailNotifications ?? true}
            />
            <Checkbox
              name="weeklyDigest"
              label="Weekly digest"
              defaultChecked={user?.settings?.weeklyDigest ?? true}
            />
            <Checkbox
              name="publicProfile"
              label="Public profile"
              defaultChecked={user?.settings?.publicProfile ?? true}
            />
            <Checkbox
              name="shareActivity"
              label="Share activity"
              defaultChecked={user?.settings?.shareActivity ?? true}
            />
            <Checkbox
              name="showTransformation"
              label="Show transformation gallery"
              defaultChecked={user?.settings?.showTransformation ?? true}
            />
            <Checkbox
              name="reducedMotion"
              label="Reduced motion"
              defaultChecked={user?.settings?.reducedMotion ?? false}
            />
            <Checkbox
              name="soundEffects"
              label="Sound effects"
              defaultChecked={user?.settings?.soundEffects ?? true}
            />
            <FormSubmit pendingLabel="Saving preferences...">Save preferences</FormSubmit>
          </form>
        </Card>
      </div>
    </div>
  );
}
