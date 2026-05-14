"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Flame, Sparkles, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";

const testimonials = [
  ["Aria Sen", "I stayed because it feels like a product designed for people with real lives, not fitness robots."],
  ["Neel Kapoor", "The streak design is addictive in the best way. Small wins suddenly feel premium."],
  ["Maya Thomas", "It finally connects mobility, recovery, food, and workouts into one daily rhythm."],
];

const featureCards = [
  {
    title: "Dashboard that breathes",
    body: "Personalized stats, streaks, hydration, sleep, and goals in one smooth command center.",
    Icon: Sparkles,
  },
  {
    title: "Workout builder",
    body: "Explore exercises, drag sessions together, favorite routines, and log completed work fast.",
    Icon: Flame,
  },
  {
    title: "AI coaching layer",
    body: "Generate workouts, build meal plans, and get smart guidance even without an API key.",
    Icon: Star,
  },
  {
    title: "Community energy",
    body: "Posts, likes, comments, follows, leaderboards, and challenge pressure that feels motivating.",
    Icon: TrendingUp,
  },
];

const pricingCards = [
  {
    name: "Starter",
    price: "Free",
    body: "Landing, dashboard, workout library, nutrition logs, and community access.",
    items: ["Dashboard", "Workout builder", "Nutrition logging"],
  },
  {
    name: "Pro",
    price: "$19/mo",
    body: "AI coaching, advanced charts, challenge boosts, and premium progress tools.",
    items: ["AI workout generator", "AI meal planner", "Achievement sharing"],
  },
  {
    name: "Team",
    price: "$49/mo",
    body: "For creators, coaches, and small communities who want shared challenges and accountability.",
    items: ["Group leaderboards", "Custom challenges", "Community insights"],
  },
];

export function LandingPage() {
  return (
    <div>
      <MarketingNavbar />
      <main>
        <section className="page-shell section-space pt-8">
          <div className="hero-glow glass-panel relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <div className="subtle-grid absolute inset-0 opacity-45" />
            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <Badge>Fitness that actually sticks</Badge>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl"
                >
                  The premium fitness website that turns effort into momentum.
                </motion.h1>
                <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">
                  Workouts, nutrition, streaks, recovery, challenges, and AI guidance in one
                  addictive app-like flow built for modern life.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/signup">
                    <Button size="lg">
                      Start building your streak
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="secondary" size="lg">
                      Explore the live demo
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    AI-ready with mock fallback
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    PWA + offline support
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Real full-stack tracking
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.55 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <StatCard label="Streak retention" value="91%" detail="Users who cross seven days usually keep going." />
                <StatCard label="Avg weekly sessions" value="4.8" detail="Momentum is designed into the product loop." />
                <Card className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted">Transformation engine</p>
                      <p className="mt-3 text-3xl font-semibold">Track what changes, not just what hurts.</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-accent" />
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Weight", "-4.3 kg"],
                      ["Waist", "-9 cm"],
                      ["Energy", "+37%"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[1.25rem] bg-surface-soft p-4">
                        <p className="text-sm text-muted">{label}</p>
                        <p className="mt-2 text-2xl font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="page-shell section-space">
          <SectionHeading
            eyebrow="Why it hooks"
            title="A modern fitness loop built to feel premium from the first tap."
            description="The product is designed like a daily operating system, not a static tracker."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map(({ title, body, Icon }) => (
              <Card key={title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(61,137,255,0.18),rgba(20,217,166,0.18))]">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm text-muted">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="stories" className="page-shell section-space">
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <Badge>Transformation showcase</Badge>
              <h2 className="mt-4 text-4xl font-semibold">Small daily structure compounds fast.</h2>
              <p className="mt-4 text-muted">
                Fitnity helps users see real movement across weight, waist, strength, hydration,
                recovery, and consistency. The result feels less like chasing motivation and more
                like installing momentum.
              </p>
            </Card>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                ["Day 01", "Low energy, irregular food rhythm, no stable training loop."],
                ["Day 84", "Steadier weight trend, better recovery, repeatable training confidence."],
              ].map(([label, text], index) => (
                <Card
                  key={label}
                  className={index === 1 ? "bg-[linear-gradient(160deg,rgba(34,228,183,0.16),rgba(110,168,255,0.12))]" : ""}
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">{label}</p>
                  <div className="mt-6 h-48 rounded-[1.5rem] bg-[radial-gradient(circle_at_top,rgba(110,168,255,0.35),transparent_40%),linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
                  <p className="mt-4 text-sm text-muted">{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell section-space">
          <SectionHeading
            eyebrow="Loved by users"
            title="A fitness product people keep talking about."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map(([name, quote]) => (
              <Card key={name}>
                <div className="flex gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-base text-foreground/92">{quote}</p>
                <p className="mt-5 text-sm font-semibold">{name}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="pricing" className="page-shell section-space">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple pricing with premium value from day one."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricingCards.map(({ name, price, body, items }, index) => (
              <Card
                key={name}
                className={index === 1 ? "border-accent/30 bg-[linear-gradient(160deg,rgba(61,137,255,0.14),rgba(20,217,166,0.12))]" : ""}
              >
                <p className="text-sm uppercase tracking-[0.24em] text-muted">{name}</p>
                <p className="mt-4 text-5xl font-semibold">{price}</p>
                <p className="mt-4 text-sm text-muted">{body}</p>
                <div className="mt-6 space-y-3">
                  {items.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/signup" className="mt-8 inline-flex">
                  <Button variant={index === 1 ? "primary" : "secondary"}>
                    Choose {name}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <section id="faq" className="page-shell section-space">
          <SectionHeading eyebrow="FAQ" title="Answers before you even need to ask." />
          <div className="mt-8 space-y-4">
            {[
              ["Does it work without an AI key?", "Yes. The AI layer falls back to smart local mock responses so the whole product still works immediately."],
              ["Can I use it on mobile?", "Yes. The entire product is mobile-first, responsive, and installable as a PWA with offline support."],
              ["Can I deploy it easily?", "Yes. The codebase is one Next.js project designed for GitHub, Vercel, Netlify, and Render without a split frontend/backend setup."],
            ].map(([question, answer]) => (
              <details key={question} className="glass-panel rounded-[1.5rem] p-5">
                <summary className="cursor-pointer list-none text-lg font-semibold">{question}</summary>
                <p className="mt-3 text-sm text-muted">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="page-shell section-space pt-0">
          <Card className="hero-glow text-center">
            <Badge>Ready to move</Badge>
            <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
              Make your next fitness streak feel inevitable.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
              Start with the seeded live demo, then make it yours with your own workouts,
              nutrition logs, progress data, and community momentum.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">Create your account</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Open the demo
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
