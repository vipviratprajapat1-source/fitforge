import bcrypt from "bcryptjs";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { createSampleUsers } from "../../../shared/fitnessData.js";

const seed = async () => {
  await connectDb();
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("FitForge123!", 10);
  const sampleUsers = createSampleUsers().map((user) => ({
    ...user,
    passwordHash,
    settings: {
      theme: "dark",
      dailyReminderTime: "07:00",
      notificationsEnabled: false,
      smartReminders: true,
      voiceGuidance: true,
    },
  }));

  await User.insertMany(sampleUsers);
  console.log(`Seeded ${sampleUsers.length} users. Default password: FitForge123!`);
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
