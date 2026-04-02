import express from "express";
import Profile from "../models/Profile.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= SAVE / UPDATE PROFILE ================= */
router.post("/", protect, async (req, res) => {
  try {

    const { name, email, skills, experience, role, bio } = req.body;

    // ✅ basic validation
    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email required" });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        name,
        email,
        skills,
        experience,
        role,
        bio,
        user: req.user._id
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      message: "Profile saved successfully",
      profile
    });

  } catch (err) {
    console.error("PROFILE SAVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


/* ================= GET PROFILE ================= */
router.get("/", protect, async (req, res) => {
  try {

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(200).json(null); // ✅ no profile case
    }

    res.status(200).json(profile);

  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/", protect, async (req, res) => {
  try {

    await Profile.findOneAndDelete({ user: req.user._id });

    res.json({ message: "Profile deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;