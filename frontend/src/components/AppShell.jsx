import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/library", label: "Workouts" },
  { to: "/builder", label: "Builder" },
  { to: "/progress", label: "Progress" },
  { to: "/meals", label: "Meals" },
  { to: "/social", label: "Social" },
  { to: "/calendar", label: "Calendar" },
];

export const AppShell = ({ children }) => {
  const auth = useAuth();
  const { user, updateProfile } = useAppData();

  const toggleTheme = () => {
    updateProfile({
      settings: {
        theme: user.settings.theme === "dark" ? "light" : "dark",
      },
    });
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col justify-between rounded-[32px] border border-white/10 bg-slate-950/80 p-6 text-slate-100 backdrop-blur lg:flex">
          <div className="space-y-8">
            <Link to="/" className="block">
              <p className="font-display text-3xl tracking-tight">FitForge</p>
              <p className="mt-2 text-sm text-slate-400">
                Home workout, no equipment, full momentum.
              </p>
            </Link>

            <div className="surface-card !bg-white/5 !text-slate-100">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Athlete Snapshot
              </p>
              <p className="mt-3 text-2xl font-semibold">{user.name}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">Level</p>
                  <p className="font-semibold">{user.stats.level}</p>
                </div>
                <div>
                  <p className="text-slate-400">Streak</p>
                  <p className="font-semibold">{user.stats.streak} days</p>
                </div>
                <div>
                  <p className="text-slate-400">XP</p>
                  <p className="font-semibold">{user.stats.xp}</p>
                </div>
                <div>
                  <p className="text-slate-400">Mode</p>
                  <p className="font-semibold">{auth.isAuthenticated ? "Cloud" : "Guest"}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <button type="button" className="button-secondary w-full" onClick={toggleTheme}>
              Switch to {user.settings.theme === "dark" ? "Light" : "Dark"} mode
            </button>
            {auth.isAuthenticated ? (
              <button type="button" className="button-secondary w-full" onClick={auth.logout}>
                Log out
              </button>
            ) : (
              <Link className="button-primary w-full" to="/auth">
                Create account
              </Link>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="surface-card mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em]" style={{ color: "rgb(var(--text-soft))" }}>
                No equipment fitness at home
              </p>
              <h1 className="mt-2 font-display text-3xl md:text-4xl">
                Train smarter, keep your streak, and build momentum anywhere.
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="chip">{user.profile.fitnessLevel}</span>
              <span className="chip">{user.profile.goals.join(", ")}</span>
              <span className="chip">{auth.isAuthenticated ? "MongoDB sync" : "Local guest save"}</span>
            </div>
          </header>

          {children}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-2xl px-3 py-2 text-xs font-medium ${isActive ? "bg-white/10 text-white" : "text-slate-400"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
