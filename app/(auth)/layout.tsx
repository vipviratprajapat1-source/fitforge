import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="hero-glow glass-panel relative hidden overflow-hidden rounded-[2rem] p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="subtle-grid absolute inset-0 opacity-40" />
          <div className="relative">
            <Logo />
            <p className="mt-10 max-w-lg text-5xl font-semibold leading-tight">
              Build the version of you that does not keep starting over.
            </p>
            <p className="mt-5 max-w-lg text-lg text-muted">
              Workouts, nutrition, streaks, recovery, community, and AI coaching in one
              premium rhythm.
            </p>
          </div>
          <div className="relative grid gap-4 md:grid-cols-3">
            {[
              ["14k+", "workouts completed this week"],
              ["91%", "users who keep a 7-day streak"],
              ["4.9/5", "average experience rating"],
            ].map(([value, label]) => (
              <div key={value} className="glass-panel rounded-[1.5rem] p-4">
                <p className="text-2xl font-semibold">{value}</p>
                <p className="mt-2 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel flex items-center rounded-[2rem] p-5 sm:p-8">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
