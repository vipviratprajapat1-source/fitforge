import { Router } from "express";
import { body } from "express-validator";
import {
  addFriend,
  createChallenge,
  listChallenges,
  listFriends,
  searchUsers,
} from "../controllers/socialController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/friends", listFriends);
router.get("/friends/search", searchUsers);
router.post("/friends", [body("friendId").isMongoId()], addFriend);
router.get("/challenges", listChallenges);
router.post(
  "/challenges",
  [body("friendId").isMongoId(), body("title").isLength({ min: 2, max: 80 })],
  createChallenge
);

export default router;

