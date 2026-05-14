import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fitnity",
    short_name: "Fitnity",
    description:
      "Premium fitness operating system for workouts, meals, streaks, progress, and community.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#060916",
    theme_color: "#060916",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/app-icon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        src: "/icons/app-maskable.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "maskable",
      },
    ],
  };
}
