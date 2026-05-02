import { createSampleUsers, FITNESS_LEVELS } from "../../../shared/fitnessData.js";
import { User } from "../models/User.js";

const mapEntries = (users) =>
  users.map((user, index) => ({
    rank: index + 1,
    id: String(user._id || user.id || user.email),
    name: user.name,
    username: user.username,
    streak: user.stats?.streak || 0,
    totalWorkouts: user.stats?.totalWorkouts || 0,
    level: user.stats?.level || 1,
    xp: user.stats?.xp || 0,
    fitnessLevel: user.profile?.fitnessLevel || "Beginner",
  }));

export const getLeaderboard = async (req, res, next) => {
  try {
    const requestedLevel = req.query.level;
    const levels = requestedLevel ? [requestedLevel] : FITNESS_LEVELS;
    const response = {};

    for (const level of levels) {
      const users = await User.find({ "profile.fitnessLevel": level })
        .sort({ "stats.streak": -1, "stats.totalWorkouts": -1, "stats.xp": -1 })
        .limit(25)
        .lean();

      const source = users.length
        ? users
        : createSampleUsers()
            .filter((entry) => entry.profile.fitnessLevel === level)
            .sort((a, b) => b.stats.streak - a.stats.streak || b.stats.totalWorkouts - a.stats.totalWorkouts);

      response[level] = mapEntries(source);
    }

    res.json({
      leaderboards: response,
    });
  } catch (error) {
    next(error);
  }
};

