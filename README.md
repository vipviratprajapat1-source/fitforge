# Fitnity

Fitnity is a full-stack modern fitness platform built as a single Next.js App Router project. It ships with authentication, dashboard analytics, workouts, nutrition tracking, AI tools, gamification, social features, progress tracking, PWA support, offline caching, and realistic seeded data.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Prisma
- SQLite for local development
- PostgreSQL-compatible schema path for production
- NextAuth credentials auth
- Zustand
- Recharts

## What’s included

- Landing page with hero, stats, testimonials, pricing, FAQ, and CTAs
- Protected dashboard with calories, streaks, hydration, sleep, XP, charts, missions, and leaderboard
- Workout system with exercise library, filters, videos, drag-and-drop builder, favorite routines, and workout logging
- AI lab with workout generation, meal planning, chatbot guidance, and recommendation mode
- Nutrition tracking with macros, meal plans, water logging, sleep logging, barcode field UI, and Indian food presets
- Social layer with posts, likes, comments, follows, and profile pages
- Challenges, XP, achievements, leaderboard, streaks, and mission rewards
- Progress charts, measurements, transformation gallery, and share-card generation
- Settings, onboarding, theme switching, browser notifications, install prompt, and offline page

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

The repo already includes a seeded local SQLite database at `prisma/dev.db`, so the app is alive immediately after install.

Demo account:

- Email: `demo@fitnity.app`
- Password: `demo12345`

## Environment

Create `.env` from `.env.example` if you want to override defaults.

Important notes:

- Local development works even without setting `NEXTAUTH_SECRET`; the app falls back to a safe local-only dev secret.
- If `OPENAI_API_KEY` is missing, the AI features return high-quality local mock responses.
- `DATABASE_URL` defaults cleanly to the local SQLite file workflow.

## Useful scripts

```bash
npm run dev
npm run lint
npm run build
npm run db:push
npm run db:seed
npm run db:reset
```

## Local database

- Default schema: `prisma/schema.prisma`
- Default database: `prisma/dev.db`
- Seed script: `prisma/seed.ts`

If you want to refresh the local demo data:

```bash
npm run db:reset
```

## PostgreSQL production path

Prisma requires the schema provider to match the target database, so this repo includes a second production schema:

- Local SQLite: `prisma/schema.prisma`
- Production PostgreSQL: `prisma/schema.postgresql.prisma`

The Prisma config supports switching schemas through `PRISMA_SCHEMA_PATH`.

## Vercel deployment

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Add environment variables:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `OPENAI_API_KEY` optional
- `OPENAI_MODEL` optional
- `PRISMA_SCHEMA_PATH=prisma/schema.postgresql.prisma`

4. Set the build command to:

```bash
npm run build
```

5. Before first production traffic, sync the production schema with:

```bash
PRISMA_SCHEMA_PATH=prisma/schema.postgresql.prisma npx prisma db push
```

If you seed production intentionally, run:

```bash
PRISMA_SCHEMA_PATH=prisma/schema.postgresql.prisma npm run db:seed
```

## Netlify / Render / other hosts

- Use the same environment variables
- Point `DATABASE_URL` at PostgreSQL
- Set `PRISMA_SCHEMA_PATH=prisma/schema.postgresql.prisma`
- Run `npm run build` as the build command
- Run `npx prisma db push` with the same `PRISMA_SCHEMA_PATH` before serving traffic

## Project structure

```text
app/
  (marketing)/
  (auth)/
  (app)/
  api/
components/
  ai/
  auth/
  charts/
  dashboard/
  landing/
  layout/
  nutrition/
  onboarding/
  progress/
  social/
  ui/
  workouts/
lib/
  actions/
  ai/
  auth.ts
  db.ts
  gamification.ts
prisma/
  schema.prisma
  schema.postgresql.prisma
  seed.ts
public/
```

## Notes

- The app is intentionally a single project with Next.js handling both UI and server logic.
- Social, nutrition, workout, challenge, and progress actions all mutate real Prisma-backed data.
- Achievement share cards are generated at `/api/share/achievement/[slug]`.
