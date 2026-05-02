const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const FITNESS_LEVELS = ["Beginner", "Intermediate", "Pro", "Max"];
export const GOALS = [
  "Fat loss",
  "Muscle gain",
  "Six pack",
  "Biceps",
  "Height growth",
  "Full body",
];
export const AGE_GROUPS = ["Below 18", "Above 18"];
export const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];
export const INJURY_TAGS = [
  "Knee pain",
  "Back pain",
  "Wrist sensitivity",
  "Shoulder tightness",
  "Low mobility",
];
export const DURATIONS = [10, 15, 20, 25, 30, 45, 60];

export const LEVEL_CONFIG = {
  Beginner: { workSeconds: 30, restSeconds: 25, intensity: 1.05, label: "Easy Flow" },
  Intermediate: { workSeconds: 35, restSeconds: 20, intensity: 1.25, label: "Steady Push" },
  Pro: { workSeconds: 40, restSeconds: 15, intensity: 1.45, label: "Athlete Grind" },
  Max: { workSeconds: 45, restSeconds: 10, intensity: 1.7, label: "Elite Burn" },
};

export const QUOTES = [
  "The best gym is the one you can start in right now.",
  "A strong routine beats a perfect plan you never begin.",
  "Momentum is built one honest rep at a time.",
  "Your body notices the work even when progress feels quiet.",
  "Tiny actions repeated daily become visible confidence.",
  "You do not need equipment to build discipline.",
  "Show up tired if you must, just keep the promise.",
  "Consistency is the shortcut everyone overlooks.",
  "Train where you are, with what you have, today.",
  "Every home workout is proof that excuses are losing.",
  "Strength grows in the moments you choose to continue.",
  "Confidence follows completed workouts, not saved ideas.",
];

export const BADGES = [
  { id: "first-burn", title: "First Burn", description: "Complete your first workout.", threshold: 1, type: "workouts" },
  { id: "triple-streak", title: "Triple Threat", description: "Maintain a 3-day streak.", threshold: 3, type: "streak" },
  { id: "weekly-warrior", title: "Weekly Warrior", description: "Maintain a 7-day streak.", threshold: 7, type: "streak" },
  { id: "fortnight-fire", title: "Fortnight Fire", description: "Maintain a 14-day streak.", threshold: 14, type: "streak" },
  { id: "thirty-rise", title: "Thirty Rise", description: "Maintain a 30-day streak.", threshold: 30, type: "streak" },
  { id: "calorie-ace", title: "Calorie Ace", description: "Burn 1,500 total calories.", threshold: 1500, type: "calories" },
  { id: "builder", title: "Builder", description: "Create your first custom workout.", threshold: 1, type: "customWorkouts" },
  { id: "social-spark", title: "Social Spark", description: "Add your first friend.", threshold: 1, type: "friends" },
  { id: "planner", title: "Planner", description: "Set your first goal tracker.", threshold: 1, type: "goals" },
  { id: "maxed-focus", title: "Maxed Focus", description: "Reach user level 10.", threshold: 10, type: "userLevel" },
];

export const EXERCISE_LIBRARY = [
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    muscleGroup: "Full Body",
    type: "cardio",
    caloriesFactor: 1.15,
    defaultSeconds: 30,
    contraindications: ["Knee pain"],
    animation: "star-jump",
    steps: [
      "Stand tall with feet together and arms by your sides.",
      "Jump feet apart while sweeping your arms overhead.",
      "Land softly and return to the starting position.",
    ],
  },
  {
    id: "march-in-place",
    name: "Power March",
    muscleGroup: "Cardio",
    type: "recovery",
    caloriesFactor: 0.8,
    defaultSeconds: 30,
    contraindications: [],
    animation: "march",
    steps: [
      "Stand upright and brace your core.",
      "Drive one knee up at a time with energetic arm swings.",
      "Keep a quick, smooth rhythm without leaning back.",
    ],
  },
  {
    id: "high-knees",
    name: "High Knees",
    muscleGroup: "Core + Cardio",
    type: "cardio",
    caloriesFactor: 1.3,
    defaultSeconds: 30,
    contraindications: ["Knee pain", "Back pain"],
    animation: "high-knees",
    steps: [
      "Lift your chest and look forward.",
      "Run in place while driving knees toward hip height.",
      "Land on the balls of your feet and keep your core tight.",
    ],
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    muscleGroup: "Core",
    type: "core",
    caloriesFactor: 1.35,
    defaultSeconds: 35,
    contraindications: ["Wrist sensitivity", "Back pain"],
    animation: "plank-drive",
    steps: [
      "Set up in a strong plank with shoulders over wrists.",
      "Drive one knee toward your chest, then switch quickly.",
      "Keep hips steady and avoid bouncing your lower back.",
    ],
  },
  {
    id: "plank-shoulder-taps",
    name: "Plank Shoulder Taps",
    muscleGroup: "Core + Shoulders",
    type: "core",
    caloriesFactor: 1.1,
    defaultSeconds: 30,
    contraindications: ["Wrist sensitivity", "Shoulder tightness"],
    animation: "plank-tap",
    steps: [
      "Hold a plank with feet slightly wider than hip width.",
      "Tap one shoulder with the opposite hand.",
      "Alternate sides while resisting hip rotation.",
    ],
  },
  {
    id: "forearm-plank",
    name: "Forearm Plank",
    muscleGroup: "Core",
    type: "core",
    caloriesFactor: 0.95,
    defaultSeconds: 30,
    contraindications: ["Shoulder tightness"],
    animation: "plank-hold",
    steps: [
      "Place forearms under shoulders and extend your legs.",
      "Create one straight line from head to heels.",
      "Brace your abs and glutes while breathing steadily.",
    ],
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    muscleGroup: "Core",
    type: "mobility",
    caloriesFactor: 0.7,
    defaultSeconds: 35,
    contraindications: [],
    animation: "dead-bug",
    steps: [
      "Lie on your back with knees and arms lifted.",
      "Extend the opposite arm and leg slowly away from the body.",
      "Return and switch sides while keeping your lower back grounded.",
    ],
  },
  {
    id: "reverse-crunch",
    name: "Reverse Crunch",
    muscleGroup: "Lower Abs",
    type: "core",
    caloriesFactor: 1,
    defaultSeconds: 30,
    contraindications: ["Back pain"],
    animation: "reverse-crunch",
    steps: [
      "Lie on your back and bend your knees at 90 degrees.",
      "Curl your knees toward your chest by lifting your hips slightly.",
      "Lower with control without swinging your legs.",
    ],
  },
  {
    id: "bicycle-crunch",
    name: "Bicycle Crunch",
    muscleGroup: "Abs + Obliques",
    type: "core",
    caloriesFactor: 1.15,
    defaultSeconds: 30,
    contraindications: ["Back pain", "Neck sensitivity"],
    animation: "bicycle",
    steps: [
      "Lift shoulders off the floor and bring hands lightly near your head.",
      "Rotate one elbow toward the opposite knee while extending the other leg.",
      "Alternate smoothly and avoid pulling on your neck.",
    ],
  },
  {
    id: "push-ups",
    name: "Push-Ups",
    muscleGroup: "Chest + Triceps",
    type: "upper",
    caloriesFactor: 1.2,
    defaultSeconds: 35,
    contraindications: ["Wrist sensitivity", "Shoulder tightness"],
    animation: "push-up",
    steps: [
      "Set up in a plank with hands slightly wider than shoulders.",
      "Lower your chest with elbows at about a 45-degree angle.",
      "Press back up while keeping your body in one line.",
    ],
  },
  {
    id: "incline-push-ups",
    name: "Incline Push-Ups",
    muscleGroup: "Chest + Arms",
    type: "upper",
    caloriesFactor: 1,
    defaultSeconds: 35,
    contraindications: ["Wrist sensitivity"],
    animation: "push-up",
    steps: [
      "Place your hands on a stable elevated surface.",
      "Lower your chest toward the surface with controlled elbows.",
      "Press back up and keep your core engaged.",
    ],
  },
  {
    id: "diamond-push-ups",
    name: "Diamond Push-Ups",
    muscleGroup: "Triceps + Chest",
    type: "upper",
    caloriesFactor: 1.25,
    defaultSeconds: 30,
    contraindications: ["Wrist sensitivity", "Shoulder tightness"],
    animation: "push-up",
    steps: [
      "Place your hands close together under your chest.",
      "Lower slowly while keeping elbows tight to your sides.",
      "Drive up through your palms and keep your hips level.",
    ],
  },
  {
    id: "triceps-dips",
    name: "Chair Triceps Dips",
    muscleGroup: "Triceps",
    type: "upper",
    caloriesFactor: 1,
    defaultSeconds: 30,
    contraindications: ["Shoulder tightness"],
    animation: "dip",
    steps: [
      "Sit on the edge of a stable chair and place hands beside your hips.",
      "Slide off the edge and bend your elbows to lower your body.",
      "Press through your palms to return to the top.",
    ],
  },
  {
    id: "arm-circles",
    name: "Arm Circles",
    muscleGroup: "Shoulders",
    type: "mobility",
    caloriesFactor: 0.6,
    defaultSeconds: 30,
    contraindications: [],
    animation: "arm-circles",
    steps: [
      "Extend your arms out to the sides at shoulder height.",
      "Make small circles forward with steady tension.",
      "Reverse the direction halfway through the set.",
    ],
  },
  {
    id: "pike-push-ups",
    name: "Pike Push-Ups",
    muscleGroup: "Shoulders + Upper Chest",
    type: "upper",
    caloriesFactor: 1.25,
    defaultSeconds: 30,
    contraindications: ["Wrist sensitivity", "Shoulder tightness"],
    animation: "pike",
    steps: [
      "Lift hips into an inverted V shape.",
      "Bend elbows and lower the crown of your head toward the floor.",
      "Press back to the start without collapsing your shoulders.",
    ],
  },
  {
    id: "bodyweight-squats",
    name: "Bodyweight Squats",
    muscleGroup: "Legs + Glutes",
    type: "lower",
    caloriesFactor: 1.1,
    defaultSeconds: 35,
    contraindications: ["Knee pain"],
    animation: "squat",
    steps: [
      "Stand with feet just outside hip width and chest lifted.",
      "Sit back and down while tracking knees over your toes.",
      "Drive through your feet to stand tall again.",
    ],
  },
  {
    id: "sumo-squats",
    name: "Sumo Squats",
    muscleGroup: "Inner Thighs + Glutes",
    type: "lower",
    caloriesFactor: 1.1,
    defaultSeconds: 35,
    contraindications: ["Knee pain"],
    animation: "squat",
    steps: [
      "Take a wide stance with toes turned out slightly.",
      "Lower down while keeping your chest open and knees tracking outward.",
      "Squeeze your glutes as you return to standing.",
    ],
  },
  {
    id: "reverse-lunges",
    name: "Reverse Lunges",
    muscleGroup: "Legs + Glutes",
    type: "lower",
    caloriesFactor: 1.2,
    defaultSeconds: 35,
    contraindications: ["Knee pain", "Low mobility"],
    animation: "lunge",
    steps: [
      "Stand tall and step one foot back.",
      "Lower both knees until the front thigh is nearly parallel.",
      "Push through the front heel to return and switch sides.",
    ],
  },
  {
    id: "glute-bridges",
    name: "Glute Bridges",
    muscleGroup: "Glutes + Hamstrings",
    type: "lower",
    caloriesFactor: 0.8,
    defaultSeconds: 35,
    contraindications: [],
    animation: "bridge",
    steps: [
      "Lie on your back with knees bent and feet planted.",
      "Drive through your heels to lift your hips.",
      "Pause at the top and lower slowly with control.",
    ],
  },
  {
    id: "wall-sit",
    name: "Wall Sit",
    muscleGroup: "Quads",
    type: "lower",
    caloriesFactor: 0.9,
    defaultSeconds: 30,
    contraindications: ["Knee pain"],
    animation: "wall-sit",
    steps: [
      "Lean your back against a wall and slide down.",
      "Stop when your knees are roughly at 90 degrees.",
      "Hold the position while pressing your lower back into the wall.",
    ],
  },
  {
    id: "calf-raises",
    name: "Calf Raises",
    muscleGroup: "Calves",
    type: "lower",
    caloriesFactor: 0.75,
    defaultSeconds: 35,
    contraindications: [],
    animation: "calf-raise",
    steps: [
      "Stand tall with feet under your hips.",
      "Rise onto the balls of your feet as high as you can.",
      "Lower slowly and repeat without rocking forward.",
    ],
  },
  {
    id: "bear-crawl-hold",
    name: "Bear Crawl Hold",
    muscleGroup: "Shoulders + Core",
    type: "full-body",
    caloriesFactor: 1.1,
    defaultSeconds: 30,
    contraindications: ["Wrist sensitivity", "Back pain"],
    animation: "bear",
    steps: [
      "Start on all fours with knees hovering just off the floor.",
      "Stack hips over knees and shoulders over hands.",
      "Hold tension through your core without letting your back sag.",
    ],
  },
  {
    id: "burpees",
    name: "Burpees",
    muscleGroup: "Full Body",
    type: "full-body",
    caloriesFactor: 1.5,
    defaultSeconds: 30,
    contraindications: ["Knee pain", "Back pain", "Wrist sensitivity"],
    animation: "burpee",
    steps: [
      "Squat down and place your hands on the floor.",
      "Kick feet back to plank, then return feet forward.",
      "Explode upward into a jump with soft landing.",
    ],
  },
  {
    id: "side-plank",
    name: "Side Plank",
    muscleGroup: "Obliques",
    type: "core",
    caloriesFactor: 0.85,
    defaultSeconds: 30,
    contraindications: ["Shoulder tightness"],
    animation: "side-plank",
    steps: [
      "Stack your shoulder over your elbow and legs on top of each other.",
      "Lift hips to create a straight line through your body.",
      "Hold steady and switch sides halfway if needed.",
    ],
  },
  {
    id: "superman-hold",
    name: "Superman Hold",
    muscleGroup: "Lower Back + Glutes",
    type: "mobility",
    caloriesFactor: 0.7,
    defaultSeconds: 30,
    contraindications: ["Back pain"],
    animation: "superman",
    steps: [
      "Lie face down with arms extended in front.",
      "Lift your chest, arms, and legs slightly off the floor.",
      "Hold with length through the spine rather than cranking upward.",
    ],
  },
  {
    id: "bird-dog",
    name: "Bird Dog",
    muscleGroup: "Core + Posture",
    type: "mobility",
    caloriesFactor: 0.65,
    defaultSeconds: 35,
    contraindications: [],
    animation: "bird-dog",
    steps: [
      "Start on hands and knees with a neutral spine.",
      "Reach one arm forward and the opposite leg back.",
      "Pause, return, and switch sides without twisting.",
    ],
  },
  {
    id: "cat-cow",
    name: "Cat-Cow Stretch",
    muscleGroup: "Spine Mobility",
    type: "mobility",
    caloriesFactor: 0.4,
    defaultSeconds: 30,
    contraindications: [],
    animation: "cat-cow",
    steps: [
      "Begin on hands and knees with a long spine.",
      "Round your back and tuck your chin for cat.",
      "Arch gently and open the chest for cow.",
    ],
  },
  {
    id: "cobra-stretch",
    name: "Cobra Stretch",
    muscleGroup: "Abs + Hip Flexors",
    type: "mobility",
    caloriesFactor: 0.35,
    defaultSeconds: 25,
    contraindications: ["Back pain"],
    animation: "cobra",
    steps: [
      "Lie face down with hands under your shoulders.",
      "Press up gently to lift your chest.",
      "Keep shoulders away from ears and breathe into the stretch.",
    ],
  },
  {
    id: "standing-side-reach",
    name: "Standing Side Reach",
    muscleGroup: "Spine + Lats",
    type: "mobility",
    caloriesFactor: 0.4,
    defaultSeconds: 25,
    contraindications: [],
    animation: "reach",
    steps: [
      "Stand tall and clasp your hands overhead.",
      "Lean to one side while keeping hips facing forward.",
      "Return to center and repeat on the other side.",
    ],
  },
  {
    id: "hip-openers",
    name: "Hip Openers",
    muscleGroup: "Hips + Mobility",
    type: "mobility",
    caloriesFactor: 0.45,
    defaultSeconds: 30,
    contraindications: [],
    animation: "hip-open",
    steps: [
      "Stand with hands on hips and a soft bend in the knees.",
      "Lift one knee and circle it outward.",
      "Switch directions and then repeat on the other side.",
    ],
  },
  {
    id: "shadow-boxing",
    name: "Shadow Boxing",
    muscleGroup: "Upper Body + Cardio",
    type: "cardio",
    caloriesFactor: 1.2,
    defaultSeconds: 35,
    contraindications: ["Shoulder tightness"],
    animation: "boxing",
    steps: [
      "Set your stance with soft knees and hands up.",
      "Throw light punches while rotating your torso.",
      "Stay mobile on your feet and exhale with each strike.",
    ],
  },
  {
    id: "skater-steps",
    name: "Skater Steps",
    muscleGroup: "Glutes + Cardio",
    type: "cardio",
    caloriesFactor: 1.15,
    defaultSeconds: 30,
    contraindications: ["Knee pain"],
    animation: "skater",
    steps: [
      "Step or hop laterally to one side.",
      "Sweep the opposite leg behind you with a slight hinge.",
      "Push off and move to the other side with control.",
    ],
  },
  {
    id: "standing-crunch",
    name: "Standing Crunch",
    muscleGroup: "Core",
    type: "core",
    caloriesFactor: 0.85,
    defaultSeconds: 30,
    contraindications: [],
    animation: "standing-crunch",
    steps: [
      "Place hands lightly behind your head and lift your chest.",
      "Drive one knee up while crunching your torso down toward it.",
      "Alternate sides and stay tall between reps.",
    ],
  },
];

const GOAL_FOCUS_MAP = {
  "Fat loss": ["cardio", "full-body", "lower", "core"],
  "Muscle gain": ["upper", "lower", "full-body"],
  "Six pack": ["core", "cardio", "mobility"],
  Biceps: ["upper", "core"],
  "Height growth": ["mobility", "core", "recovery"],
  "Full body": ["full-body", "cardio", "upper", "lower"],
};

const INJURY_SAFE_MAP = {
  "Knee pain": ["mobility", "core", "upper", "recovery"],
  "Back pain": ["mobility", "recovery", "lower", "core"],
  "Wrist sensitivity": ["lower", "mobility", "recovery", "core"],
  "Shoulder tightness": ["lower", "core", "mobility", "recovery"],
  "Low mobility": ["mobility", "recovery", "core", "lower"],
};

const titleFlavor = {
  Beginner: ["Fresh Start", "Momentum", "Ease In", "Everyday Move"],
  Intermediate: ["Steady Sculpt", "Focused Charge", "Power Session", "Daily Edge"],
  Pro: ["Athlete Forge", "Lean Grind", "Intensity Flow", "Strong Circuit"],
  Max: ["Elite Surge", "No-Excuse Burner", "Peak Circuit", "Iron Mind"],
};

const targetMuscleGroups = {
  "Fat loss": ["Full Body", "Core", "Legs"],
  "Muscle gain": ["Chest + Triceps", "Legs + Glutes", "Shoulders"],
  "Six pack": ["Core", "Lower Abs", "Obliques"],
  Biceps: ["Chest + Arms", "Triceps", "Shoulders"],
  "Height growth": ["Spine Mobility", "Posture", "Core"],
  "Full body": ["Full Body", "Legs + Glutes", "Core + Cardio"],
};

const mealBlueprints = {
  Vegetarian: {
    "Fat loss": [
      ["Greek yogurt bowl", 320, 22],
      ["Paneer quinoa salad", 510, 31],
      ["Lentil spinach soup", 360, 24],
      ["Roasted chickpeas", 180, 10],
    ],
    "Muscle gain": [
      ["Oats with milk, banana, and peanut butter", 520, 21],
      ["Paneer rice bowl", 690, 38],
      ["Tofu stir fry with noodles", 610, 32],
      ["Trail mix and soy milk", 290, 13],
    ],
  },
  "Non-vegetarian": {
    "Fat loss": [
      ["Egg white veggie scramble", 280, 26],
      ["Chicken millet bowl", 500, 41],
      ["Fish and greens plate", 420, 36],
      ["Protein yogurt cup", 190, 15],
    ],
    "Muscle gain": [
      ["Eggs, toast, and fruit", 540, 30],
      ["Chicken rice power plate", 720, 46],
      ["Salmon sweet potato dinner", 650, 42],
      ["Greek yogurt with nuts", 310, 18],
    ],
  },
};

export const createMealPlans = () => {
  const plans = [];

  ["Vegetarian", "Non-vegetarian"].forEach((preference) => {
    ["Fat loss", "Muscle gain"].forEach((goal) => {
      for (let day = 1; day <= 7; day += 1) {
        const blueprint = mealBlueprints[preference][goal];
        const offset = day - 1;
        const meals = blueprint.map(([name, calories, protein], index) => ({
          slot: ["Breakfast", "Lunch", "Dinner", "Snack"][index],
          name: `${name} Day ${day}`,
          calories: calories + offset * 12,
          protein: protein + (index % 2 === 0 ? 1 : 0),
        }));

        plans.push({
          id: `${slugify(preference)}-${slugify(goal)}-day-${day}`,
          title: `${preference} ${goal} Day ${day}`,
          goal,
          preference,
          day,
          calories: meals.reduce((sum, meal) => sum + meal.calories, 0),
          protein: meals.reduce((sum, meal) => sum + meal.protein, 0),
          meals,
        });
      }
    });
  });

  return plans;
};

const getExercisePool = ({ goal, injury, womenSpecific }) => {
  const focusTypes = injury ? INJURY_SAFE_MAP[injury] : GOAL_FOCUS_MAP[goal];

  return EXERCISE_LIBRARY.filter((exercise) => {
    const matchesFocus = focusTypes.includes(exercise.type);
    const isSafe = injury ? !exercise.contraindications.includes(injury) : true;
    const womenBoost =
      !womenSpecific ||
      ["lower", "core", "mobility", "cardio", "full-body"].includes(exercise.type);
    return matchesFocus && isSafe && womenBoost;
  });
};

const buildExercises = ({ level, duration, goal, injury, womenSpecific, seed }) => {
  const pool = getExercisePool({ goal, injury, womenSpecific });
  const levelDetails = LEVEL_CONFIG[level];
  const count = duration <= 15 ? 5 : duration <= 25 ? 6 : duration <= 45 ? 8 : 10;
  const exercises = [];

  for (let index = 0; index < count; index += 1) {
    const source = pool[(seed + index) % pool.length] || EXERCISE_LIBRARY[(seed + index) % EXERCISE_LIBRARY.length];
    const workSeconds = Math.max(20, Math.min(60, levelDetails.workSeconds + (index % 2 === 0 ? 0 : 5)));

    exercises.push({
      id: `${source.id}-${index + 1}`,
      name: source.name,
      exerciseId: source.id,
      muscleGroup: source.muscleGroup,
      steps: source.steps,
      animation: source.animation,
      workSeconds,
      restSeconds: levelDetails.restSeconds,
      tips: injury ? [`Designed to stay friendly for ${injury.toLowerCase()}.`] : ["Keep your pace smooth and controlled."],
    });
  }

  return exercises;
};

const buildWorkout = ({
  ageGroup,
  fitnessLevel,
  duration,
  goal,
  womenSpecific = false,
  injury = "",
  index,
}) => {
  const exercises = buildExercises({
    level: fitnessLevel,
    duration,
    goal,
    injury,
    womenSpecific,
    seed: index * 3 + duration,
  });
  const targetMuscles = targetMuscleGroups[goal];
  const caloriesBurned = Math.round(
    duration * LEVEL_CONFIG[fitnessLevel].intensity * (injury ? 0.9 : 1) * (womenSpecific ? 1.02 : 1)
  );
  const flavor = titleFlavor[fitnessLevel][index % titleFlavor[fitnessLevel].length];
  const descriptor = injury
    ? `${injury} Support`
    : womenSpecific
      ? "Women Specific"
      : ageGroup === "Below 18"
        ? "Teen Safe"
        : "Adult Focus";

  return {
    id: slugify(`${descriptor}-${goal}-${fitnessLevel}-${duration}-${index}`),
    title: `${descriptor} ${goal} ${flavor}`,
    description: `A ${duration}-minute ${goal.toLowerCase()} session for ${fitnessLevel.toLowerCase()} athletes training at home without equipment.`,
    duration,
    caloriesBurned,
    targetMuscles,
    difficulty: fitnessLevel,
    ageGroup,
    womenSpecific,
    injuriesSupported: injury ? [injury] : [],
    goals: [goal],
    restSeconds: LEVEL_CONFIG[fitnessLevel].restSeconds,
    category: injury ? "Injury Support" : womenSpecific ? "Women Specific" : "Goal Based",
    tags: [
      goal,
      fitnessLevel,
      ageGroup,
      descriptor,
      womenSpecific ? "Women Specific" : "All",
      injury || "No Equipment",
    ],
    exercises,
  };
};

export const createWorkoutCatalog = () => {
  const workouts = [];
  let index = 0;

  AGE_GROUPS.forEach((ageGroup) => {
    FITNESS_LEVELS.forEach((fitnessLevel) => {
      GOALS.forEach((goal) => {
        [15, 25, 45, 60].forEach((duration) => {
          workouts.push(
            buildWorkout({
              ageGroup,
              fitnessLevel,
              duration,
              goal,
              index,
            })
          );
          index += 1;
        });
      });
    });
  });

  FITNESS_LEVELS.forEach((fitnessLevel) => {
    ["Fat loss", "Muscle gain", "Six pack"].forEach((goal) => {
      [10, 20, 30].forEach((duration) => {
        workouts.push(
          buildWorkout({
            ageGroup: "Above 18",
            fitnessLevel,
            duration,
            goal,
            womenSpecific: true,
            index,
          })
        );
        index += 1;
      });
    });
  });

  ["Knee pain", "Back pain", "Wrist sensitivity"].forEach((injury) => {
    FITNESS_LEVELS.forEach((fitnessLevel) => {
      [10, 20, 30].forEach((duration) => {
        workouts.push(
          buildWorkout({
            ageGroup: "Above 18",
            fitnessLevel,
            duration,
            goal: injury === "Back pain" ? "Height growth" : "Full body",
            injury,
            index,
          })
        );
        index += 1;
      });
    });
  });

  return workouts;
};

export const createSampleUsers = () => {
  const names = [
    "Aarav Blaze",
    "Maya Pulse",
    "Noah Grind",
    "Sara Motion",
    "Ishaan Core",
    "Kiara Lift",
    "Dev Streak",
    "Nina Flow",
    "Arjun Tempo",
    "Zoya Fire",
    "Rehan Sprint",
    "Anaya Forge",
    "Kabir Charge",
    "Meera Rise",
    "Rohan Focus",
    "Tara Swift",
  ];

  return names.map((name, index) => {
    const fitnessLevel = FITNESS_LEVELS[index % FITNESS_LEVELS.length];
    const totalWorkouts = 18 + index * 3;
    const streak = 2 + (index % 7) * 2;
    const xp = totalWorkouts * 120 + streak * 30;
    return {
      name,
      username: slugify(name),
      email: `${slugify(name)}@fitforge.app`,
      profile: {
        ageGroup: index % 2 === 0 ? "Above 18" : "Below 18",
        gender: index % 3 === 0 ? "Female" : "Male",
        fitnessLevel,
        goals: [GOALS[index % GOALS.length]],
        injuries: index % 5 === 0 ? ["Knee pain"] : [],
      },
      stats: {
        streak,
        longestStreak: streak + 4,
        totalWorkouts,
        totalCalories: totalWorkouts * 85,
        xp,
        level: Math.max(1, Math.floor(xp / 500) + 1),
      },
      customWorkouts: [],
      history: [],
      bodyProgress: [],
      goals: [],
      friends: [],
      challenges: [],
    };
  });
};

export const getMotivationalQuote = (date = new Date()) => {
  const key = new Date(date).toISOString().slice(0, 10);
  const hash = key.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return QUOTES[hash % QUOTES.length];
};

export const getDailyChallenge = (date = new Date()) => {
  const workouts = createWorkoutCatalog();
  const key = new Date(date).toISOString().slice(0, 10);
  const hash = key.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const workout = workouts[hash % workouts.length];
  return {
    id: `challenge-${key}`,
    date: key,
    title: `${workout.goals[0]} Sprint`,
    description: `Complete ${workout.title} and finish with a 60-second power march burnout.`,
    workoutId: workout.id,
    rewardXp: 180,
  };
};

export const calculateAchievements = ({
  streak = 0,
  totalWorkouts = 0,
  totalCalories = 0,
  customWorkouts = 0,
  friends = 0,
  goals = 0,
  userLevel = 1,
}) =>
  BADGES.filter((badge) => {
    const metrics = {
      streak,
      workouts: totalWorkouts,
      calories: totalCalories,
      customWorkouts,
      friends,
      goals,
      userLevel,
    };
    return metrics[badge.type] >= badge.threshold;
  });

export const getRecommendedWorkouts = ({
  profile,
  workouts = createWorkoutCatalog(),
  availableMinutes = 20,
  recentWorkoutIds = [],
}) => {
  const goals = profile?.goals?.length ? profile.goals : ["Full body"];
  const ageGroup = profile?.ageGroup || "Above 18";
  const fitnessLevel = profile?.fitnessLevel || "Beginner";
  const injuries = profile?.injuries || [];

  const primaryGoal = goals[0];
  return workouts
    .filter((workout) => workout.duration <= availableMinutes + 10)
    .filter((workout) => workout.ageGroup === ageGroup || workout.ageGroup === "Above 18")
    .filter((workout) => workout.difficulty === fitnessLevel)
    .filter((workout) => workout.goals.includes(primaryGoal) || workout.goals.includes("Full body"))
    .filter((workout) => injuries.every((injury) => workout.injuriesSupported.length === 0 || workout.injuriesSupported.includes(injury)))
    .filter((workout) => !recentWorkoutIds.includes(workout.id))
    .slice(0, 6);
};

export const calculateStreak = (history = []) => {
  if (!history.length) {
    return 0;
  }

  const dates = [...new Set(history.map((entry) => entry.completedAt.slice(0, 10)))].sort().reverse();
  let streak = 0;
  let cursor = new Date();

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (dates.includes(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (streak === 0) {
      cursor.setDate(cursor.getDate() - 1);
      const yesterday = cursor.toISOString().slice(0, 10);
      if (dates.includes(yesterday)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
    }
    break;
  }

  return streak;
};

export const summarizeStats = (history = [], customWorkouts = [], friends = [], goals = []) => {
  const totalWorkouts = history.length;
  const totalCalories = history.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0);
  const streak = calculateStreak(history);
  const xp = history.reduce((sum, entry) => sum + (entry.xpEarned || 100), 0) + customWorkouts.length * 60;
  const level = Math.max(1, Math.floor(xp / 500) + 1);
  const achievements = calculateAchievements({
    streak,
    totalWorkouts,
    totalCalories,
    customWorkouts: customWorkouts.length,
    friends: friends.length,
    goals: goals.length,
    userLevel: level,
  });

  return {
    streak,
    longestStreak: Math.max(streak, 0),
    totalWorkouts,
    totalCalories,
    xp,
    level,
    achievements,
  };
};

export const createBootstrapPayload = () => {
  const workouts = createWorkoutCatalog();
  const mealPlans = createMealPlans();
  const sampleUsers = createSampleUsers();

  return {
    workouts,
    mealPlans,
    badges: BADGES,
    quotes: QUOTES,
    dailyChallenge: getDailyChallenge(),
    sampleUsers,
  };
};
