import { Router } from "express";
import { getBootstrap } from "../controllers/appController.js";

const router = Router();

router.get("/bootstrap", getBootstrap);
router.get("/health", (req, res) => res.json({ ok: true }));

export default router;

