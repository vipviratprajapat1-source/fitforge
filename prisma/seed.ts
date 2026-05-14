import "dotenv/config";

import { createPrismaAdapter } from "../lib/prisma-adapter";

import { hash } from "bcryptjs";
import { addDays, startOfDay, subDays } from "date-fns";

import {
  ActivityType,
  ChallengeType,
  Difficulty,
  FitnessGoal,
  FitnessLevel,
  GoalMetric,
  MealType,
  MuscleGroup,
  NotificationType,
  PrismaClient,
  ThemeMode,
} from "@prisma/client";

const prisma = new PrismaClient({
  adapter: createPrismaAdapter(),
});

function artwork(title: string, subtitle: string, accent: string) {
  const svg = `
    <svg width="720" height="920" viewBox="0 0 720 920" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="720" height="920" rx="52" fill="#06111F"/>
      <rect x="28" y="28" width="664" height="864" rx="36" fill="url(#paint0_linear)" fill-opacity="0.16" stroke="rgba(255,255,255,0.12)"/>
      <circle cx="164" cy="168" r="112" fill="${accent}" fill-opacity="0.16"/>
      <circle cx="572" cy="742" r="132" fill="#22E4B7" fill-opacity="0.12"/>
      <path d="M232 690C232 562 308 396 358 324C408 396 486 562 486 690C486 780 432 842 358 842C286 842 232 780 232 690Z" fill="${accent}" fill-opacity="0.18"/>
      <path d="M322 258C322 236 338 216 358 216C380 216 394 234 394 258C394 280 378 298 358 298C338 298 322 280 322 258Z" fill="#F5F9FF"/>
      <text x="60" y="96" fill="#90A2C2" font-size="28" font-family="Arial, sans-serif" letter-spacing="6">FITNITY MILESTONE</text>
      <text x="60" y="164" fill="#F5F9FF" font-size="54" font-family="Arial, sans-serif" font-weight="700">${title}</text>
      <text x="60" y="214" fill="#B8C7DF" font-size="26" font-family="Arial, sans-serif">${subtitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function clearDatabase() {
  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.userMissionProgress.deleteMany(),
    prisma.dailyMission.deleteMany(),
    prisma.userAchievement.deleteMany(),
    prisma.achievement.deleteMany(),
    prisma.challengeEntry.deleteMany(),
    prisma.challenge.deleteMany(),
    prisma.like.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.follow.deleteMany(),
    prisma.transformationPhoto.deleteMany(),
    prisma.progressEntry.deleteMany(),
    prisma.dailyMetric.deleteMany(),
    prisma.mealPlan.deleteMany(),
    prisma.nutritionEntry.deleteMany(),
    prisma.activityLog.deleteMany(),
    prisma.favoriteWorkout.deleteMany(),
    prisma.workoutRoutineItem.deleteMany(),
    prisma.workoutRoutine.deleteMany(),
    prisma.exercise.deleteMany(),
    prisma.userSettings.deleteMany(),
    prisma.streak.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function main() {
  await clearDatabase();

  const passwordHash = await hash("demo12345", 10);
  const today = startOfDay(new Date());

  const [demoUser, ariaUser, rohanUser, mayaUser] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Neel Kapoor",
        username: "neelmoves",
        email: "demo@fitnity.app",
        passwordHash,
        bio: "Product designer rebuilding his energy one smart streak at a time.",
        location: "Bengaluru",
        age: 29,
        heightCm: 176,
        currentWeightKg: 78,
        targetWeightKg: 72,
        fitnessGoal: FitnessGoal.RECOMPOSITION,
        fitnessLevel: FitnessLevel.INTERMEDIATE,
        xp: 1320,
        level: 6,
        dailyCalorieGoal: 2300,
        dailyProteinGoal: 155,
        dailyWaterGoalMl: 3200,
        dailySleepGoalHours: 8,
        isPublic: true,
        onboardingCompleted: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Aria Sen",
        username: "ariastrong",
        email: "aria@fitnity.app",
        passwordHash,
        bio: "Hypertrophy nerd. Loves lower-body day and brutally honest habit systems.",
        location: "Mumbai",
        age: 31,
        heightCm: 168,
        currentWeightKg: 64,
        targetWeightKg: 61,
        fitnessGoal: FitnessGoal.MUSCLE_GAIN,
        fitnessLevel: FitnessLevel.ADVANCED,
        xp: 2410,
        level: 10,
        dailyCalorieGoal: 2450,
        dailyProteinGoal: 165,
        dailyWaterGoalMl: 3400,
        dailySleepGoalHours: 8,
        isPublic: true,
        onboardingCompleted: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Rohan Mehta",
        username: "rohanruns",
        email: "rohan@fitnity.app",
        passwordHash,
        bio: "Half-marathon runner balancing speed work with desk-life sanity.",
        location: "Delhi",
        age: 27,
        heightCm: 181,
        currentWeightKg: 73,
        targetWeightKg: 71,
        fitnessGoal: FitnessGoal.ENDURANCE,
        fitnessLevel: FitnessLevel.INTERMEDIATE,
        xp: 1825,
        level: 7,
        dailyCalorieGoal: 2600,
        dailyProteinGoal: 145,
        dailyWaterGoalMl: 3600,
        dailySleepGoalHours: 8,
        isPublic: true,
        onboardingCompleted: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Maya Thomas",
        username: "mayaflow",
        email: "maya@fitnity.app",
        passwordHash,
        bio: "Pilates, mobility, and calm consistency over chaos.",
        location: "Pune",
        age: 34,
        heightCm: 163,
        currentWeightKg: 58,
        targetWeightKg: 56,
        fitnessGoal: FitnessGoal.WELLNESS,
        fitnessLevel: FitnessLevel.INTERMEDIATE,
        xp: 1560,
        level: 6,
        dailyCalorieGoal: 2050,
        dailyProteinGoal: 118,
        dailyWaterGoalMl: 2900,
        dailySleepGoalHours: 8,
        isPublic: true,
        onboardingCompleted: true,
      },
    }),
  ]);

  await prisma.userSettings.createMany({
    data: [
      {
        userId: demoUser.id,
        theme: ThemeMode.SYSTEM,
        workoutReminders: true,
        nutritionReminders: true,
        challengeAlerts: true,
        pushNotifications: true,
        emailNotifications: true,
        weeklyDigest: true,
        publicProfile: true,
        shareActivity: true,
        showTransformation: true,
        reducedMotion: false,
        soundEffects: true,
      },
      {
        userId: ariaUser.id,
        theme: ThemeMode.DARK,
        workoutReminders: true,
        nutritionReminders: true,
        challengeAlerts: true,
        pushNotifications: true,
        emailNotifications: true,
        weeklyDigest: true,
        publicProfile: true,
        shareActivity: true,
        showTransformation: true,
        reducedMotion: false,
        soundEffects: true,
      },
      {
        userId: rohanUser.id,
        theme: ThemeMode.LIGHT,
        workoutReminders: true,
        nutritionReminders: true,
        challengeAlerts: true,
        pushNotifications: true,
        emailNotifications: false,
        weeklyDigest: false,
        publicProfile: true,
        shareActivity: true,
        showTransformation: true,
        reducedMotion: false,
        soundEffects: false,
      },
      {
        userId: mayaUser.id,
        theme: ThemeMode.SYSTEM,
        workoutReminders: true,
        nutritionReminders: true,
        challengeAlerts: true,
        pushNotifications: true,
        emailNotifications: true,
        weeklyDigest: true,
        publicProfile: true,
        shareActivity: true,
        showTransformation: true,
        reducedMotion: false,
        soundEffects: true,
      },
    ],
  });

  await prisma.streak.createMany({
    data: [
      { userId: demoUser.id, current: 8, best: 19, lastActiveAt: today },
      { userId: ariaUser.id, current: 17, best: 28, lastActiveAt: today },
      { userId: rohanUser.id, current: 11, best: 16, lastActiveAt: today },
      { userId: mayaUser.id, current: 9, best: 23, lastActiveAt: today },
    ],
  });

  const achievementSeeds = [
    ["streak-starter", "Streak Starter", "Hit 3 consecutive active days", "Flame", "bronze", 60, "STREAK", 3],
    ["hydration-hero", "Hydration Hero", "Reach your water goal 5 days in a week", "Droplets", "silver", 120, "WATER", 5],
    ["macro-master", "Macro Master", "Hit protein target on 7 tracked days", "Salad", "gold", 180, "PROTEIN", 7],
    ["iron-signal", "Iron Signal", "Finish 10 strength sessions", "Dumbbell", "gold", 240, "WORKOUTS", 10],
    ["community-glow", "Community Glow", "Earn 25 likes from the community", "Heart", "silver", 150, "SOCIAL", 25],
    ["legend-mode", "Legend Mode", "Reach level 10", "Trophy", "platinum", 300, "LEVEL", 10],
  ] as const;

  for (const [slug, name, description, icon, tier, xpReward, requirementType, requirementValue] of achievementSeeds) {
    await prisma.achievement.create({
      data: {
        slug,
        name,
        description,
        icon,
        tier,
        xpReward,
        requirementType,
        requirementValue,
      },
    });
  }

  const achievements = await prisma.achievement.findMany();
  const achievementBySlug = Object.fromEntries(achievements.map((item) => [item.slug, item]));

  await prisma.userAchievement.createMany({
    data: [
      {
        userId: demoUser.id,
        achievementId: achievementBySlug["streak-starter"].id,
      },
      {
        userId: demoUser.id,
        achievementId: achievementBySlug["hydration-hero"].id,
      },
      {
        userId: demoUser.id,
        achievementId: achievementBySlug["macro-master"].id,
      },
      {
        userId: ariaUser.id,
        achievementId: achievementBySlug["legend-mode"].id,
      },
      {
        userId: rohanUser.id,
        achievementId: achievementBySlug["iron-signal"].id,
      },
    ],
  });

  const exerciseSeeds = [
    {
      slug: "incline-push-up",
      name: "Incline Push-Up",
      description: "A beginner-friendly push variation that builds chest and triceps strength with stable form.",
      instructions: "Hands on bench or box|Brace core and glutes|Lower chest with elbows at 45 degrees|Press up without shrugging shoulders",
      tips: "Keep your body in one long line and exhale as you drive up.",
      benefits: "Builds upper body confidence and shoulder-friendly pressing strength.",
      category: "Strength",
      muscleGroup: MuscleGroup.CHEST,
      difficulty: Difficulty.BEGINNER,
      equipment: "Bench",
      durationMinutes: 6,
      caloriesPerMinute: 5.5,
      videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
      tags: "push|upper body|beginner",
      isFeatured: true,
    },
    {
      slug: "goblet-squat",
      name: "Goblet Squat",
      description: "A posture-friendly squat for building leg strength, depth, and core tension.",
      instructions: "Hold one dumbbell close to chest|Sit hips down and back|Keep chest tall|Drive through mid-foot to stand",
      tips: "Think elbows inside knees at the bottom to open your hips.",
      benefits: "Great for lower body strength, mobility, and calorie burn.",
      category: "Strength",
      muscleGroup: MuscleGroup.LEGS,
      difficulty: Difficulty.INTERMEDIATE,
      equipment: "Dumbbell",
      durationMinutes: 8,
      caloriesPerMinute: 7.5,
      videoUrl: "https://www.youtube.com/watch?v=MeIiIdhvXT4",
      tags: "legs|glutes|strength",
      isFeatured: true,
    },
    {
      slug: "band-row",
      name: "Resistance Band Row",
      description: "A scalable pulling move for the back and posture muscles.",
      instructions: "Anchor band at chest height|Pull elbows back toward ribs|Pause and squeeze shoulder blades|Return with control",
      tips: "Avoid jutting your chin forward as you row.",
      benefits: "Improves posture and balances pressing volume.",
      category: "Strength",
      muscleGroup: MuscleGroup.BACK,
      difficulty: Difficulty.BEGINNER,
      equipment: "Band",
      durationMinutes: 7,
      caloriesPerMinute: 5.8,
      videoUrl: "https://www.youtube.com/watch?v=roCP6wCXPqo",
      tags: "pull|back|home workout",
      isFeatured: false,
    },
    {
      slug: "walking-lunge",
      name: "Walking Lunge",
      description: "A unilateral leg builder that challenges balance, coordination, and control.",
      instructions: "Step forward into a long stance|Drop back knee toward floor|Push through front heel|Alternate sides continuously",
      tips: "Stay tall instead of collapsing forward over your front leg.",
      benefits: "Improves single-leg stability and athletic movement.",
      category: "Strength",
      muscleGroup: MuscleGroup.GLUTES,
      difficulty: Difficulty.INTERMEDIATE,
      equipment: "Bodyweight",
      durationMinutes: 7,
      caloriesPerMinute: 7.2,
      videoUrl: "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
      tags: "legs|glutes|conditioning",
      isFeatured: false,
    },
    {
      slug: "mountain-climber",
      name: "Mountain Climber",
      description: "A fast full-body cardio move that drives heart rate and core engagement.",
      instructions: "Start in a high plank|Drive one knee forward|Switch legs quickly|Keep shoulders stacked over wrists",
      tips: "Slow down slightly to keep your hips low and your core braced.",
      benefits: "Blends cardio, shoulder stability, and core work.",
      category: "Conditioning",
      muscleGroup: MuscleGroup.CARDIO,
      difficulty: Difficulty.INTERMEDIATE,
      equipment: "Bodyweight",
      durationMinutes: 5,
      caloriesPerMinute: 9,
      videoUrl: "https://www.youtube.com/watch?v=nmwgirgXLYM",
      tags: "cardio|core|hiit",
      isFeatured: true,
    },
    {
      slug: "plank-shoulder-tap",
      name: "Plank Shoulder Tap",
      description: "Core stability with anti-rotation challenge for better trunk control.",
      instructions: "Set up in a high plank|Tap opposite shoulder without rocking hips|Alternate slowly|Keep feet slightly wider than hips",
      tips: "Imagine balancing a glass of water on your lower back.",
      benefits: "Great for building a stronger brace during lifting.",
      category: "Core",
      muscleGroup: MuscleGroup.CORE,
      difficulty: Difficulty.INTERMEDIATE,
      equipment: "Bodyweight",
      durationMinutes: 6,
      caloriesPerMinute: 6.1,
      videoUrl: "https://www.youtube.com/watch?v=6DZw4sy8kDs",
      tags: "core|stability|bodyweight",
      isFeatured: false,
    },
    {
      slug: "kettlebell-deadlift",
      name: "Kettlebell Deadlift",
      description: "A hip hinge essential for posterior chain strength and safer lifting mechanics.",
      instructions: "Stand over kettlebell with soft knees|Push hips back|Grab handle and brace core|Drive hips through to stand tall",
      tips: "Think zipper up the thighs, not leaning backward at the top.",
      benefits: "Builds glutes, hamstrings, and confidence with hip hinging.",
      category: "Strength",
      muscleGroup: MuscleGroup.PULL,
      difficulty: Difficulty.BEGINNER,
      equipment: "Kettlebell",
      durationMinutes: 7,
      caloriesPerMinute: 7,
      videoUrl: "https://www.youtube.com/watch?v=1uDiW5--rAE",
      tags: "hinge|glutes|strength",
      isFeatured: true,
    },
    {
      slug: "dumbbell-shoulder-press",
      name: "Dumbbell Shoulder Press",
      description: "Vertical pressing strength for shoulders and upper-body power.",
      instructions: "Start dumbbells at shoulder height|Brace ribcage down|Press overhead in a slight arc|Lower with control",
      tips: "Keep your forearms stacked and avoid flaring the ribs.",
      benefits: "Builds shoulder strength and upper-body confidence.",
      category: "Strength",
      muscleGroup: MuscleGroup.SHOULDERS,
      difficulty: Difficulty.INTERMEDIATE,
      equipment: "Dumbbells",
      durationMinutes: 7,
      caloriesPerMinute: 6.6,
      videoUrl: "https://www.youtube.com/watch?v=qEwKCR5JCog",
      tags: "shoulders|push|strength",
      isFeatured: false,
    },
    {
      slug: "hip-thrust",
      name: "Hip Thrust",
      description: "A glute-focused move that builds power with low back-friendly mechanics.",
      instructions: "Upper back on bench|Feet planted shoulder-width|Drive hips up and squeeze glutes|Pause before lowering",
      tips: "Keep your chin tucked and ribs down to feel the glutes more.",
      benefits: "Improves glute strength for running, lifting, and posture.",
      category: "Strength",
      muscleGroup: MuscleGroup.GLUTES,
      difficulty: Difficulty.INTERMEDIATE,
      equipment: "Bench",
      durationMinutes: 7,
      caloriesPerMinute: 6.8,
      videoUrl: "https://www.youtube.com/watch?v=LM8XHLYJoYs",
      tags: "glutes|posterior chain|strength",
      isFeatured: false,
    },
    {
      slug: "jump-rope-intervals",
      name: "Jump Rope Intervals",
      description: "Explosive cardio bursts for coordination, calves, and efficient calorie burn.",
      instructions: "Stay light on the balls of your feet|Keep elbows in|Work in timed intervals|Breathe rhythmically",
      tips: "Start with 30 seconds on and 30 seconds off if you are new.",
      benefits: "Excellent for conditioning and athletic rhythm.",
      category: "Conditioning",
      muscleGroup: MuscleGroup.CARDIO,
      difficulty: Difficulty.ADVANCED,
      equipment: "Jump rope",
      durationMinutes: 10,
      caloriesPerMinute: 11.2,
      videoUrl: "https://www.youtube.com/watch?v=1BZMInQXgzA",
      tags: "cardio|agility|conditioning",
      isFeatured: true,
    },
    {
      slug: "mobility-flow",
      name: "Mobility Flow",
      description: "A controlled sequence for hips, thoracic spine, and recovery days.",
      instructions: "Move slowly through the sequence|Match movement to breathing|Pause in tight positions|Stay pain-free",
      tips: "Use the flow after long desk sessions or intense training days.",
      benefits: "Improves recovery and movement quality.",
      category: "Recovery",
      muscleGroup: MuscleGroup.MOBILITY,
      difficulty: Difficulty.BEGINNER,
      equipment: "Mat",
      durationMinutes: 12,
      caloriesPerMinute: 3.2,
      videoUrl: "https://www.youtube.com/watch?v=4BOTvaRaDjI",
      tags: "mobility|recovery|stretching",
      isFeatured: false,
    },
    {
      slug: "burpee",
      name: "Burpee",
      description: "A demanding conditioning staple that trains total-body power and grit.",
      instructions: "Squat down and plant hands|Kick feet back to plank|Return feet forward|Jump and reach overhead",
      tips: "Step back instead of jumping if you need lower impact reps.",
      benefits: "Maximizes conditioning in minimal time.",
      category: "Conditioning",
      muscleGroup: MuscleGroup.FULL_BODY,
      difficulty: Difficulty.ADVANCED,
      equipment: "Bodyweight",
      durationMinutes: 5,
      caloriesPerMinute: 10.8,
      videoUrl: "https://www.youtube.com/watch?v=TU8QYVW0gDU",
      tags: "hiit|full body|conditioning",
      isFeatured: true,
    },
  ] as const;

  for (const exercise of exerciseSeeds) {
    await prisma.exercise.create({ data: exercise });
  }

  const exercises = await prisma.exercise.findMany();
  const exerciseBySlug = Object.fromEntries(exercises.map((item) => [item.slug, item]));

  const routines = [
    {
      slug: "momentum-reset",
      title: "Momentum Reset",
      description: "A confidence-first 28 minute session for busy weekdays when you still want a serious win.",
      category: "Starter",
      difficulty: Difficulty.BEGINNER,
      durationMinutes: 28,
      estimatedCalories: 230,
      focusArea: "Full body activation",
      musicUrl: "https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh",
      isTemplate: true,
      isPublished: true,
      items: [
        ["incline-push-up", 1, 3, "12", undefined, 45, "Own the tempo"],
        ["goblet-squat", 2, 3, "10", undefined, 60, "Drive knees out"],
        ["band-row", 3, 3, "14", undefined, 45, "Pause at the squeeze"],
        ["plank-shoulder-tap", 4, 3, "20 taps", undefined, 30, "Stay square"],
      ],
    },
    {
      slug: "strength-after-work",
      title: "Strength After Work",
      description: "A lower-stress but high-payoff strength block built for evening training.",
      category: "Strength",
      difficulty: Difficulty.INTERMEDIATE,
      durationMinutes: 42,
      estimatedCalories: 360,
      focusArea: "Legs and upper push",
      musicUrl: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
      isTemplate: true,
      isPublished: true,
      items: [
        ["kettlebell-deadlift", 1, 4, "8", undefined, 75, "Brace before each rep"],
        ["hip-thrust", 2, 4, "10", undefined, 60, "Two-second squeeze at top"],
        ["dumbbell-shoulder-press", 3, 4, "10", undefined, 60, "Stay stacked"],
        ["walking-lunge", 4, 3, "16 steps", undefined, 45, "Long clean strides"],
      ],
    },
    {
      slug: "cardio-burn-wave",
      title: "Cardio Burn Wave",
      description: "Short, hard intervals for days when you want sweat, endorphins, and zero wasted motion.",
      category: "Conditioning",
      difficulty: Difficulty.ADVANCED,
      durationMinutes: 24,
      estimatedCalories: 295,
      focusArea: "Conditioning and core",
      musicUrl: "https://open.spotify.com/playlist/37i9dQZF1DWXxauMBOQPxX",
      isTemplate: true,
      isPublished: true,
      items: [
        ["jump-rope-intervals", 1, undefined, undefined, 300, 45, "Work in hard intervals"],
        ["mountain-climber", 2, undefined, undefined, 60, 30, "Fast feet, low hips"],
        ["burpee", 3, undefined, undefined, 45, 30, "Step back for lower impact"],
        ["mobility-flow", 4, undefined, undefined, 360, 0, "Cool down deliberately"],
      ],
    },
    {
      slug: "neel-desk-break-builder",
      title: "Neel's Desk Break Builder",
      description: "A practical lunchtime circuit for posture, legs, and a mental reset.",
      category: "Custom",
      difficulty: Difficulty.INTERMEDIATE,
      durationMinutes: 31,
      estimatedCalories: 248,
      focusArea: "Core and posture",
      musicUrl: "https://open.spotify.com/playlist/37i9dQZF1DX889U0CL85jj",
      isTemplate: false,
      isPublished: false,
      userId: demoUser.id,
      items: [
        ["goblet-squat", 1, 3, "12", undefined, 45, "Stay smooth"],
        ["band-row", 2, 3, "15", undefined, 40, "Ribs down"],
        ["incline-push-up", 3, 3, "10", undefined, 40, "Strong lockout"],
        ["mobility-flow", 4, undefined, undefined, 480, 0, "Keep breathing"],
      ],
    },
  ] as const;

  for (const routine of routines) {
    const createdRoutine = await prisma.workoutRoutine.create({
      data: {
        userId: "userId" in routine ? routine.userId : undefined,
        slug: routine.slug,
        title: routine.title,
        description: routine.description,
        category: routine.category,
        difficulty: routine.difficulty,
        durationMinutes: routine.durationMinutes,
        estimatedCalories: routine.estimatedCalories,
        focusArea: routine.focusArea,
        musicUrl: routine.musicUrl,
        isTemplate: routine.isTemplate,
        isPublished: routine.isPublished,
      },
    });

    for (const [exerciseSlug, sortOrder, sets, reps, durationSeconds, restSeconds, notes] of routine.items) {
      await prisma.workoutRoutineItem.create({
        data: {
          routineId: createdRoutine.id,
          exerciseId: exerciseBySlug[exerciseSlug].id,
          sortOrder,
          sets: sets ?? null,
          reps: reps ?? null,
          durationSeconds: durationSeconds ?? null,
          restSeconds: restSeconds ?? null,
          notes,
        },
      });
    }
  }

  const routineRecords = await prisma.workoutRoutine.findMany();
  const routineBySlug = Object.fromEntries(routineRecords.map((item) => [item.slug, item]));

  await prisma.favoriteWorkout.createMany({
    data: [
      {
        userId: demoUser.id,
        routineId: routineBySlug["strength-after-work"].id,
      },
      {
        userId: demoUser.id,
        routineId: routineBySlug["cardio-burn-wave"].id,
      },
      {
        userId: ariaUser.id,
        routineId: routineBySlug["momentum-reset"].id,
      },
    ],
  });

  await prisma.follow.createMany({
    data: [
      { followerId: demoUser.id, followingId: ariaUser.id },
      { followerId: demoUser.id, followingId: rohanUser.id },
      { followerId: mayaUser.id, followingId: demoUser.id },
      { followerId: rohanUser.id, followingId: demoUser.id },
    ],
  });

  const dates = Array.from({ length: 7 }, (_, index) => subDays(today, 6 - index));
  const metricSeed = [
    [2500, 7.1, 7420, 78.6, 2140, 380],
    [2900, 7.8, 9102, 78.2, 2265, 410],
    [3200, 8.2, 10331, 77.9, 2210, 520],
    [2800, 7.6, 8790, 77.7, 2155, 335],
    [3400, 8.1, 11540, 77.5, 2340, 610],
    [3000, 7.9, 9880, 77.3, 2275, 420],
    [2600, 7.4, 8422, 77.1, 2090, 290],
  ] as const;

  for (const [index, date] of dates.entries()) {
    const [waterMl, sleepHours, steps, weightKg, caloriesConsumed, caloriesBurned] =
      metricSeed[index];
    await prisma.dailyMetric.create({
      data: {
        userId: demoUser.id,
        date,
        waterMl,
        sleepHours,
        steps,
        weightKg,
        caloriesConsumed,
        caloriesBurned,
        moodScore: 7 + (index % 3),
      },
    });
  }

  await prisma.nutritionEntry.createMany({
    data: [
      {
        userId: demoUser.id,
        date: today,
        mealType: MealType.BREAKFAST,
        name: "Masala oats with Greek yogurt",
        calories: 410,
        protein: 24,
        carbs: 48,
        fat: 12,
        fiber: 8,
        quantity: 1,
        unit: "bowl",
        isIndianFood: true,
      },
      {
        userId: demoUser.id,
        date: today,
        mealType: MealType.LUNCH,
        name: "Paneer tikka bowl with jeera rice",
        calories: 620,
        protein: 35,
        carbs: 61,
        fat: 24,
        fiber: 7,
        quantity: 1,
        unit: "plate",
        isIndianFood: true,
      },
      {
        userId: demoUser.id,
        date: today,
        mealType: MealType.SNACK,
        name: "Cold brew protein shake",
        calories: 220,
        protein: 31,
        carbs: 14,
        fat: 5,
        fiber: 3,
        quantity: 1,
        unit: "bottle",
        barcode: "8901234567890",
        isIndianFood: false,
      },
      {
        userId: demoUser.id,
        date: today,
        mealType: MealType.DINNER,
        name: "Rajma chawal with cucumber salad",
        calories: 570,
        protein: 22,
        carbs: 84,
        fat: 14,
        fiber: 11,
        quantity: 1,
        unit: "plate",
        isIndianFood: true,
      },
    ],
  });

  await prisma.mealPlan.createMany({
    data: [
      {
        userId: demoUser.id,
        title: "Performance breakfast",
        mealType: MealType.BREAKFAST,
        date: today,
        itemsSummary: "Overnight oats|Banana|Whey isolate|Chia seeds",
        calories: 520,
        protein: 36,
        carbs: 58,
        fat: 16,
        notes: "Use on harder training mornings.",
        aiGenerated: true,
      },
      {
        userId: demoUser.id,
        title: "Lean dinner reset",
        mealType: MealType.DINNER,
        date: addDays(today, 1),
        itemsSummary: "Tandoori salmon|Saffron rice|Sauteed beans",
        calories: 610,
        protein: 44,
        carbs: 52,
        fat: 21,
        notes: "High protein with easier digestion before sleep.",
        aiGenerated: true,
      },
    ],
  });

  await prisma.progressEntry.createMany({
    data: [
      {
        userId: demoUser.id,
        date: subDays(today, 84),
        weightKg: 81.4,
        bodyFat: 23.4,
        chestCm: 104,
        waistCm: 94,
        hipsCm: 101,
        armsCm: 33.5,
        thighsCm: 58,
        notes: "Starting point. Energy was inconsistent and desk fatigue was high.",
      },
      {
        userId: demoUser.id,
        date: subDays(today, 56),
        weightKg: 79.6,
        bodyFat: 21.8,
        chestCm: 103,
        waistCm: 90,
        hipsCm: 99,
        armsCm: 34,
        thighsCm: 57.4,
        notes: "First month of consistency. Sleep is finally stabilizing.",
      },
      {
        userId: demoUser.id,
        date: subDays(today, 28),
        weightKg: 78.1,
        bodyFat: 20.9,
        chestCm: 102,
        waistCm: 87,
        hipsCm: 97.6,
        armsCm: 34.6,
        thighsCm: 56.9,
        notes: "Work capacity is up. Clothes fit lighter around the waist.",
      },
      {
        userId: demoUser.id,
        date: today,
        weightKg: 77.1,
        bodyFat: 19.8,
        chestCm: 101.4,
        waistCm: 85,
        hipsCm: 96.8,
        armsCm: 35,
        thighsCm: 56.2,
        notes: "Best energy stretch in months. Strength feels more repeatable.",
      },
    ],
  });

  await prisma.transformationPhoto.createMany({
    data: [
      {
        userId: demoUser.id,
        stage: "Before",
        imageData: artwork("Day 01", "Resetting the baseline", "#6EA8FF"),
        caption: "Desk-heavy season, low energy, barely any routine.",
        date: subDays(today, 84),
        isPublic: true,
      },
      {
        userId: demoUser.id,
        stage: "After",
        imageData: artwork("Day 84", "Waist down 9cm, energy way up", "#22E4B7"),
        caption: "More structure, better food rhythm, and strength that sticks.",
        date: today,
        isPublic: true,
      },
    ],
  });

  await prisma.dailyMission.createMany({
    data: [
      {
        slug: `hydrate-${today.toISOString()}`,
        title: "Hydrate like an athlete",
        description: "Finish 3 liters of water before dinner.",
        metric: GoalMetric.WATER,
        targetValue: 3000,
        xpReward: 55,
        activeDate: today,
      },
      {
        slug: `protein-${today.toISOString()}`,
        title: "Protein anchor",
        description: "Reach at least 140 grams of protein.",
        metric: GoalMetric.PROTEIN,
        targetValue: 140,
        xpReward: 70,
        activeDate: today,
      },
      {
        slug: `steps-${today.toISOString()}`,
        title: "Movement pulse",
        description: "Cross 9,000 steps before the day ends.",
        metric: GoalMetric.STEPS,
        targetValue: 9000,
        xpReward: 50,
        activeDate: today,
      },
    ],
  });

  const missions = await prisma.dailyMission.findMany();
  await prisma.userMissionProgress.createMany({
    data: missions.map((mission, index) => ({
      userId: demoUser.id,
      missionId: mission.id,
      progress: index === 0 ? 2600 : index === 1 ? 112 : 8422,
      completedAt: null,
    })),
  });

  await prisma.challenge.createMany({
    data: [
      {
        slug: "seven-day-surge",
        title: "Seven Day Surge",
        description: "Complete 5 workouts in 7 days and claim a big XP burst.",
        type: ChallengeType.WORKOUTS,
        rewardXp: 260,
        targetValue: 5,
        startsAt: subDays(today, 2),
        endsAt: addDays(today, 5),
        isFeatured: true,
      },
      {
        slug: "hydration-heroics",
        title: "Hydration Heroics",
        description: "Hit your water goal for 6 of the next 7 days.",
        type: ChallengeType.HYDRATION,
        rewardXp: 180,
        targetValue: 6,
        startsAt: today,
        endsAt: addDays(today, 6),
        isFeatured: true,
      },
      {
        slug: "sleep-balance-league",
        title: "Sleep Balance League",
        description: "Average at least 7.7 hours of sleep this week.",
        type: ChallengeType.SLEEP,
        rewardXp: 200,
        targetValue: 7,
        startsAt: today,
        endsAt: addDays(today, 6),
        isFeatured: false,
      },
    ],
  });

  const challenges = await prisma.challenge.findMany();
  const challengeBySlug = Object.fromEntries(challenges.map((item) => [item.slug, item]));

  await prisma.challengeEntry.createMany({
    data: [
      {
        challengeId: challengeBySlug["seven-day-surge"].id,
        userId: demoUser.id,
        progress: 3,
        rank: 2,
        completed: false,
      },
      {
        challengeId: challengeBySlug["seven-day-surge"].id,
        userId: ariaUser.id,
        progress: 4,
        rank: 1,
        completed: false,
      },
      {
        challengeId: challengeBySlug["seven-day-surge"].id,
        userId: rohanUser.id,
        progress: 2,
        rank: 3,
        completed: false,
      },
      {
        challengeId: challengeBySlug["hydration-heroics"].id,
        userId: demoUser.id,
        progress: 4,
        rank: 2,
        completed: false,
      },
      {
        challengeId: challengeBySlug["hydration-heroics"].id,
        userId: mayaUser.id,
        progress: 5,
        rank: 1,
        completed: false,
      },
    ],
  });

  const postOne = await prisma.post.create({
    data: {
      userId: ariaUser.id,
      content:
        "Swapped my usual scroll break for five heavy sets of hip thrusts and it changed the entire day. Protect your momentum before your mood negotiates with you.",
      mood: "Focused",
      imageData: artwork("Lower Day", "4x10 hip thrusts and zero excuses", "#FF9D60"),
    },
  });

  const postTwo = await prisma.post.create({
    data: {
      userId: rohanUser.id,
      content:
        "Easy run, nasal breathing only, and a proper cooldown. Recovery discipline is finally making my hard sessions better.",
      mood: "Calm",
    },
  });

  const postThree = await prisma.post.create({
    data: {
      userId: demoUser.id,
      content:
        "Logged every meal for six straight days. The surprising part: structure feels lighter than guessing.",
      mood: "Motivated",
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        postId: postOne.id,
        userId: demoUser.id,
        content: "That line about mood negotiating is painfully accurate.",
      },
      {
        postId: postThree.id,
        userId: mayaUser.id,
        content: "That is the exact tipping point. Once the friction drops, habits stop feeling fragile.",
      },
      {
        postId: postTwo.id,
        userId: ariaUser.id,
        content: "Recovery is the underrated flex.",
      },
    ],
  });

  await prisma.like.createMany({
    data: [
      { postId: postOne.id, userId: demoUser.id },
      { postId: postOne.id, userId: rohanUser.id },
      { postId: postTwo.id, userId: demoUser.id },
      { postId: postTwo.id, userId: mayaUser.id },
      { postId: postThree.id, userId: ariaUser.id },
      { postId: postThree.id, userId: rohanUser.id },
    ],
  });

  await prisma.post.update({
    where: { id: postOne.id },
    data: { likesCount: 2, commentsCount: 1 },
  });
  await prisma.post.update({
    where: { id: postTwo.id },
    data: { likesCount: 2, commentsCount: 1 },
  });
  await prisma.post.update({
    where: { id: postThree.id },
    data: { likesCount: 2, commentsCount: 1 },
  });

  await prisma.activityLog.createMany({
    data: [
      {
        userId: demoUser.id,
        routineId: routineBySlug["strength-after-work"].id,
        type: ActivityType.WORKOUT,
        title: "Finished Strength After Work",
        note: "All four blocks complete. Added 2 reps to the final hip thrust set.",
        date: subDays(today, 1),
        durationMinutes: 44,
        caloriesBurned: 412,
        xpEarned: 84,
        completed: true,
      },
      {
        userId: demoUser.id,
        type: ActivityType.HYDRATION,
        title: "Hydration goal hit",
        note: "3.2 liters before 8pm.",
        date: subDays(today, 2),
        waterMl: 3200,
        xpEarned: 24,
        completed: true,
      },
      {
        userId: demoUser.id,
        type: ActivityType.SLEEP,
        title: "Slept 8.1 hours",
        note: "Phone out of the bedroom helped a lot.",
        date: subDays(today, 3),
        sleepHours: 8.1,
        xpEarned: 18,
        completed: true,
      },
      {
        userId: demoUser.id,
        type: ActivityType.PROGRESS,
        title: "Logged a new progress snapshot",
        note: "Waist down another 2cm this month.",
        date: today,
        xpEarned: 36,
        completed: true,
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        type: NotificationType.ACHIEVEMENT,
        title: "Hydration Hero is live",
        body: "You are one strong day away from locking in the weekly hydration badge.",
        link: "/dashboard",
      },
      {
        userId: demoUser.id,
        type: NotificationType.CHALLENGE,
        title: "Seven Day Surge standings updated",
        body: "You climbed to rank #2 after yesterday's session.",
        link: "/challenges",
      },
      {
        userId: demoUser.id,
        type: NotificationType.SOCIAL,
        title: "Aria replied to your nutrition post",
        body: "Recovery is the underrated flex.",
        link: "/community",
      },
      {
        userId: demoUser.id,
        type: NotificationType.REMINDER,
        title: "Tonight's sleep window starts in 90 minutes",
        body: "Dim lights and keep caffeine done for the day.",
        link: "/settings",
      },
      {
        userId: demoUser.id,
        type: NotificationType.SYSTEM,
        title: "Your app is ready offline",
        body: "Install Fitnity to keep logging even when your connection drops.",
        link: "/dashboard",
      },
    ],
  });

  console.log("Seeded Fitnity demo data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
