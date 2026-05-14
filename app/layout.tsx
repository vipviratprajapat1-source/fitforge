import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fitnity.app"),
  title: {
    default: `${APP_NAME} | Premium Fitness OS`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "A production-ready fitness platform for workouts, nutrition, streaks, community, AI coaching, and measurable progress.",
  applicationName: APP_NAME,
  keywords: [
    "fitness tracker",
    "workout planner",
    "nutrition app",
    "fitness dashboard",
    "wellness progress",
    "gamified fitness",
  ],
  openGraph: {
    title: `${APP_NAME} | Premium Fitness OS`,
    description: APP_TAGLINE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | Premium Fitness OS`,
    description: APP_TAGLINE,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f9ff" },
    { media: "(prefers-color-scheme: dark)", color: "#060916" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground font-body antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
