import express from "express";
import multer from "multer";
import { matchResume } from "../controllers/aiController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// ✅ BOTH SUPPORT
router.post("/match", upload.single("resume"), matchResume);

export default router;