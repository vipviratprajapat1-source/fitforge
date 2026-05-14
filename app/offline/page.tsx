export default function OfflinePage() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center py-20">
      <div className="glass-panel gradient-border max-w-xl rounded-[2rem] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted">Offline Mode</p>
        <h1 className="mt-4 text-4xl font-semibold">You are still in the zone.</h1>
        <p className="mt-4 text-base text-muted">
          Fitnity cached the core shell for you. Reconnect to sync workouts, nutrition
          logs, and community activity.
        </p>
      </div>
    </main>
  );
}
