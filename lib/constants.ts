import {
  BellRing,
  Bot,
  ChartColumn,
  CircleUserRound,
  Dumbbell,
  Flame,
  Salad,
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react";

export const APP_NAME = "Fitnity";
export const APP_TAGLINE = "Build a fitness streak you actually want to keep.";

export const DEMO_CREDENTIALS = {
  email: "demo@fitnity.app",
  password: "demo12345",
};

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/workouts",
  "/nutrition",
  "/ai",
  "/community",
  "/challenges",
  "/progress",
  "/settings",
  "/onboarding",
];

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Sparkles },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", icon: Salad },
  { href: "/ai", label: "AI Lab", icon: Bot },
  { href: "/community", label: "Community", icon: CircleUserRound },
  { href: "/challenges", label: "Challenges", icon: Trophy },
  { href: "/progress", label: "Progress", icon: ChartColumn },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const QUICK_ACTIONS = [
  { key: "hydration", label: "Log water", icon: BellRing },
  { key: "streak", label: "Protect streak", icon: Flame },
  { key: "achievement", label: "Claim XP", icon: Trophy },
];

export const MOTIVATION_QUOTES = [
  "Your future energy is hiding in today's small reps.",
  "Make discipline feel luxurious and it becomes a habit.",
  "Consistency beats intensity when real life gets busy.",
  "A ten minute session still counts as a winning day.",
];

export const MUSIC_PLAYLISTS = [
  {
    title: "Lift Mode",
    description: "High-tempo electronic for heavy sets and clean focus.",
    href: "https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh",
  },
  {
    title: "Sunrise Run",
    description: "Bright cardio energy for morning momentum.",
    href: "https://open.spotify.com/playlist/37i9dQZF1DWXxauMBOQPxX",
  },
  {
    title: "Recovery Flow",
    description: "Breathable, low-pressure sound for stretching and cooldowns.",
    href: "https://open.spotify.com/playlist/37i9dQZF1DX889U0CL85jj",
  },
];
