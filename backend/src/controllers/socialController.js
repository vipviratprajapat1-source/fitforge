import { randomUUID } from "crypto";
import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { safeUserSummary, syncUserStats } from "../services/userService.js";

const throwValidationError = (req) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error("Validation failed.");
    error.status = 422;
    error.errors = result.array();
    throw error;
  }
};

export const searchUsers = asyncHandler(async (req, res) => {
  const query = String(req.query.q || "").trim();

  if (!query) {
    return res.json({ users: [] });
  }

  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [
      { name: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  })
    .select("name username profile stats")
    .limit(10);

  res.json({
    users: users.map((user) => safeUserSummary(user)),
  });
});

export const listFriends = asyncHandler(async (req, res) => {
  await req.user.populate("friends", "name username profile stats");
  res.json({
    friends: req.user.friends.map((friend) => safeUserSummary(friend)),
  });
});

export const addFriend = asyncHandler(async (req, res) => {
  throwValidationError(req);

  if (String(req.user._id) === String(req.body.friendId)) {
    return res.status(400).json({ message: "You cannot add yourself as a friend." });
  }

  const friend = await User.findById(req.body.friendId);
  if (!friend) {
    return res.status(404).json({ message: "Friend not found." });
  }

  const alreadyFriends = req.user.friends.some((id) => String(id) === String(friend._id));
  if (alreadyFriends) {
    return res.status(409).json({ message: "You are already friends." });
  }

  req.user.friends.push(friend._id);
  if (!friend.friends.some((id) => String(id) === String(req.user._id))) {
    friend.friends.push(req.user._id);
  }

  syncUserStats(req.user);
  syncUserStats(friend);
  await req.user.save();
  await friend.save();

  await req.user.populate("friends", "name username profile stats");

  res.status(201).json({
    friends: req.user.friends.map((item) => safeUserSummary(item)),
  });
});

export const listChallenges = asyncHandler(async (req, res) => {
  const friendIds = req.user.challenges.map((challenge) => challenge.friendId);
  const friends = await User.find({ _id: { $in: friendIds } }).select("name username stats");
  const friendMap = new Map(friends.map((friend) => [String(friend._id), friend]));

  res.json({
    challenges: req.user.challenges.map((challenge) => {
      const friend = friendMap.get(String(challenge.friendId));
      return {
        ...challenge.toObject(),
        friendName: friend?.name || "Friend",
        friendUsername: friend?.username || "",
        friendMetricValue: challenge.metric === "streak" ? friend?.stats?.streak || 0 : friend?.stats?.totalWorkouts || 0,
        yourMetricValue: challenge.metric === "streak" ? req.user.stats?.streak || 0 : req.user.stats?.totalWorkouts || 0,
      };
    }),
  });
});

export const createChallenge = asyncHandler(async (req, res) => {
  throwValidationError(req);

  if (String(req.user._id) === String(req.body.friendId)) {
    return res.status(400).json({ message: "You cannot challenge yourself." });
  }

  const friend = await User.findById(req.body.friendId);
  if (!friend) {
    return res.status(404).json({ message: "Friend not found." });
  }

  const challengeId = randomUUID();
  const challenge = {
    id: challengeId,
    friendId: friend._id,
    title: req.body.title,
    metric: req.body.metric || "totalWorkouts",
    target: req.body.target || 5,
    status: "active",
    createdAt: new Date(),
  };

  req.user.challenges.push(challenge);
  friend.challenges.push({
    ...challenge,
    friendId: req.user._id,
  });

  await req.user.save();
  await friend.save();

  res.status(201).json({
    challenge,
  });
});
