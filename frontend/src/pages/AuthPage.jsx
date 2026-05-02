import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const defaultProfile = {
  ageGroup: "Above 18",
  gender: "Prefer not to say",
  fitnessLevel: "Beginner",
  goals: ["Full body"],
  injuries: [],
};

export default function AuthPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profile: defaultProfile,
  });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await auth.login({
          email: form.email,
          password: form.password,
        });
      } else {
        await auth.signup(form);
      }
      navigate("/");
    } catch (submissionError) {
      setError(submissionError.message);
    }
  };

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_0.9fr]">
      <section className="surface-card flex flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgb(var(--text-soft))" }}>
            FitForge access
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight">
            Build a serious home workout routine without losing your data.
          </h1>
          <p className="mt-5 max-w-2xl text-base" style={{ color: "rgb(var(--text-soft))" }}>
            Use guest mode instantly, or create an account to sync progress, friends, custom plans,
            challenges, reminders, and leaderboard stats in MongoDB.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="metric-tile">
            <p className="text-3xl font-semibold">100+</p>
            <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              unlocked workouts
            </p>
          </div>
          <div className="metric-tile">
            <p className="text-3xl font-semibold">4</p>
            <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              separate leaderboard tiers
            </p>
          </div>
          <div className="metric-tile">
            <p className="text-3xl font-semibold">Offline</p>
            <p className="mt-2 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              core guest flows work without a network
            </p>
          </div>
        </div>
      </section>

      <section className="surface-card">
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            className={mode === "login" ? "button-primary flex-1" : "button-secondary flex-1"}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "signup" ? "button-primary flex-1" : "button-secondary flex-1"}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          {mode === "signup" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Name</span>
              <input
                className="input-field"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email</span>
            <input
              className="input-field"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Password</span>
            <input
              className="input-field"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>

          {mode === "signup" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Age group</span>
                <select
                  className="input-field"
                  value={form.profile.ageGroup}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      profile: { ...current.profile, ageGroup: event.target.value },
                    }))
                  }
                >
                  <option>Below 18</option>
                  <option>Above 18</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Gender</span>
                <select
                  className="input-field"
                  value={form.profile.gender}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      profile: { ...current.profile, gender: event.target.value },
                    }))
                  }
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Fitness level</span>
                <select
                  className="input-field"
                  value={form.profile.fitnessLevel}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      profile: { ...current.profile, fitnessLevel: event.target.value },
                    }))
                  }
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Pro</option>
                  <option>Max</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Primary goal</span>
                <select
                  className="input-field"
                  value={form.profile.goals[0]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      profile: { ...current.profile, goals: [event.target.value] },
                    }))
                  }
                >
                  <option>Fat loss</option>
                  <option>Muscle gain</option>
                  <option>Six pack</option>
                  <option>Biceps</option>
                  <option>Height growth</option>
                  <option>Full body</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium">Injuries or body issues</span>
                <input
                  className="input-field"
                  placeholder="Examples: knee pain, back pain"
                  value={form.profile.injuries.join(", ")}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        injuries: event.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      },
                    }))
                  }
                />
              </label>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <button type="submit" className="button-primary w-full" disabled={auth.loading}>
            {auth.loading ? "Working..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            className="button-secondary w-full"
            onClick={() => {
              auth.continueAsGuest();
              navigate("/");
            }}
          >
            Continue as guest
          </button>
          <Link to="/" className="block text-center text-sm" style={{ color: "rgb(var(--text-soft))" }}>
            Back to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
