<<<<<<< HEAD
# FitForge

FitForge is a full-stack, no-equipment fitness web app built for people who cannot go to the gym and still want a serious, motivating training system at home.

It includes:

- React + Tailwind frontend
- Node.js + Express backend
- MongoDB persistence for logged-in users
- JWT authentication plus guest mode
- PWA install support with offline-friendly guest flows
- 100+ unlocked workout plans
- Custom workout builder
- Smart progress tracking, XP, badges, streaks, and user leveling
- Meal planning
- Friends, challenges, and separate leaderboards by level

## Tech stack

- Frontend: React, React Router, Tailwind CSS, Vite
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Authentication: JWT
- PWA: Manifest + service worker

## Folder structure

```text
.
|-- backend
|   |-- .env.example
|   |-- package.json
|   `-- src
|       |-- app.js
|       |-- server.js
|       |-- config
|       |   |-- db.js
|       |   `-- env.js
|       |-- controllers
|       |   |-- appController.js
|       |   |-- authController.js
|       |   |-- leaderboardController.js
|       |   |-- socialController.js
|       |   |-- userController.js
|       |   `-- workoutController.js
|       |-- middleware
|       |   |-- auth.js
|       |   `-- errorHandler.js
|       |-- models
|       |   `-- User.js
|       |-- routes
|       |   |-- appRoutes.js
|       |   |-- authRoutes.js
|       |   |-- leaderboardRoutes.js
|       |   |-- socialRoutes.js
|       |   |-- userRoutes.js
|       |   `-- workoutRoutes.js
|       |-- scripts
|       |   `-- seed.js
|       |-- services
|       |   `-- userService.js
|       `-- utils
|           |-- asyncHandler.js
|           `-- token.js
|-- frontend
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   |-- vite.config.js
|   |-- public
|   |   |-- icon.svg
|   |   |-- manifest.webmanifest
|   |   `-- sw.js
|   `-- src
|       |-- App.jsx
|       |-- index.css
|       |-- main.jsx
|       |-- api
|       |   `-- client.js
|       |-- components
|       |   |-- AppShell.jsx
|       |   |-- CalendarHeatmap.jsx
|       |   |-- ExerciseVisual.jsx
|       |   |-- LeaderboardColumns.jsx
|       |   |-- ProgressChart.jsx
|       |   |-- SectionHeader.jsx
|       |   |-- StatCard.jsx
|       |   |-- WorkoutCard.jsx
|       |   `-- WorkoutPlayer.jsx
|       |-- context
|       |   |-- AppDataContext.jsx
|       |   `-- AuthContext.jsx
|       |-- hooks
|       |   `-- usePersistentState.js
|       |-- pages
|       |   |-- AuthPage.jsx
|       |   |-- BuilderPage.jsx
|       |   |-- CalendarPage.jsx
|       |   |-- DashboardPage.jsx
|       |   |-- LibraryPage.jsx
|       |   |-- MealsPage.jsx
|       |   |-- NotFoundPage.jsx
|       |   |-- ProgressPage.jsx
|       |   |-- SessionPage.jsx
|       |   `-- SocialPage.jsx
|       `-- utils
|           |-- fitnessEngine.js
|           |-- formatters.js
|           `-- notifications.js
|-- shared
|   `-- fitnessData.js
|-- .gitignore
|-- package.json
`-- README.md
```

## Core product coverage

### User system

- Guest mode with localStorage persistence
- Signup and login with JWT
- Logged-in cloud persistence with MongoDB
- Profile fields for age group, gender, level, goals, and injuries

### Workout system

- 100+ generated no-equipment workouts
- Age-based, goal-based, women-specific, and injury-support categories
- 10, 15, 20, 25, 30, 45, and 60 minute durations
- Step-by-step exercise guidance
- Exercise timer and rest timer
- Exercise visuals and optional voice guidance

### Engagement and tracking

- Daily quotes
- AI-style rule-based workout recommendations
- Quick start workout
- Daily challenge mode
- XP, level-up system, and badges
- Streak tracking
- Workout history
- Weekly and monthly chart views
- Body progress tracking
- Goal tracker
- Calendar habit view

### Social and competition

- Separate leaderboards for Beginner, Intermediate, Pro, and Max
- Add friends
- Compare progress
- Create friend challenges
- Share progress through Web Share API or clipboard fallback

### Meals and reminders

- Vegetarian and non-vegetarian daily plans
- Goal-based calories and protein totals
- Browser notification reminder support
- Smart inactivity reminder behavior

### Platform and security

- Mobile-first responsive UI
- Light mode and dark mode
- PWA manifest and service worker
- SEO meta tags for:
  - home workout
  - no equipment workout
  - fitness at home
- Validation, JWT auth, Helmet, and centralized error handling

## Setup

### Requirements

- Node.js 18+
- npm 9+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Install dependencies

```bash
npm install
```

### 2. Environment setup

Create these files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

If you are on Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Recommended backend values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fitforge
JWT_SECRET=replace-this-with-a-secure-secret
CLIENT_URL=http://localhost:5173
```

Recommended frontend value:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed sample users

```bash
npm run seed
```

The seed script creates sample leaderboard users with this default password:

```text
FitForge123!
```

Sample seeded emails include:

- `aarav-blaze@fitforge.app`
- `maya-pulse@fitforge.app`
- `noah-grind@fitforge.app`
- `sara-motion@fitforge.app`

### 4. Run the app

```bash
npm run dev
```

Frontend:

- `http://localhost:5173`

Backend:

- `http://localhost:5000`

Health check:

- `http://localhost:5000/api/health`

## Available scripts

Root:

```bash
npm run dev
npm run build
npm run start
npm run seed
```

Backend only:

```bash
npm --prefix backend run dev
npm --prefix backend run start
npm --prefix backend run seed
```

Frontend only:

```bash
npm --prefix frontend run dev
npm --prefix frontend run build
npm --prefix frontend run preview
```

## Guest mode behavior

- Guest progress is stored in localStorage
- Closing and reopening the browser keeps guest data
- Offline guest usage keeps core workout, planner, and progress features usable

## Notes

- Workout, meal, badge, quote, challenge, and sample-user data are shared from `shared/fitnessData.js`.
- Logged-in users persist progress, custom workouts, reminders, friends, and challenges in MongoDB.
- Leaderboards are separated by fitness level and ranked by streak first, then total workouts.
=======
# fitforge
this is website that help you to do workout at home without any equipment 
>>>>>>> d5319b7b11ae34fa268c3c0a87034da86a04cbf4
