import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";

const AuthPage = lazy(() => import("@/pages/AuthPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const LibraryPage = lazy(() => import("@/pages/LibraryPage"));
const BuilderPage = lazy(() => import("@/pages/BuilderPage"));
const SessionPage = lazy(() => import("@/pages/SessionPage"));
const ProgressPage = lazy(() => import("@/pages/ProgressPage"));
const MealsPage = lazy(() => import("@/pages/MealsPage"));
const SocialPage = lazy(() => import("@/pages/SocialPage"));
const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const ShellRoute = ({ children }) => <AppShell>{children}</AppShell>;

export default function App() {
  const auth = useAuth();
  const { loadingBootstrap } = useAppData();

  if (!auth.authReady || loadingBootstrap) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-card max-w-lg text-center">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgb(var(--text-soft))" }}>
            FitForge loading
          </p>
          <h1 className="mt-3 font-display text-4xl">Preparing your home workout command center</h1>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="surface-card text-center">
            Loading page...
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ShellRoute>
              <DashboardPage />
            </ShellRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ShellRoute>
              <LibraryPage />
            </ShellRoute>
          }
        />
        <Route
          path="/builder"
          element={
            <ShellRoute>
              <BuilderPage />
            </ShellRoute>
          }
        />
        <Route
          path="/session/:workoutId"
          element={
            <ShellRoute>
              <SessionPage />
            </ShellRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ShellRoute>
              <ProgressPage />
            </ShellRoute>
          }
        />
        <Route
          path="/meals"
          element={
            <ShellRoute>
              <MealsPage />
            </ShellRoute>
          }
        />
        <Route
          path="/social"
          element={
            <ShellRoute>
              <SocialPage />
            </ShellRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ShellRoute>
              <CalendarPage />
            </ShellRoute>
          }
        />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="*"
          element={
            <ShellRoute>
              <NotFoundPage />
            </ShellRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

