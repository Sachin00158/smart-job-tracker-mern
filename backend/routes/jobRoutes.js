import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats
} from "../controllers/jobController.js";

const router = express.Router();

// protect all routes
router.use(protect);

router.post("/", createJob);
router.get("/stats", getJobStats);
router.get("/", getJobs);

router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;