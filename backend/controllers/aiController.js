import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import Job from "../models/job.js";

export const matchResume = async (req, res) => {
  try {

    let resumeText = "";

    /* ================= FILE MODE ================= */
    if (req.file) {
      const buffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(buffer);
      resumeText = data.text;
    }

    /* ================= TEXT MODE ================= */
    if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    }

    /* ❌ VALIDATION */
    if (!resumeText) {
      return res.status(400).json({ message: "Resume missing" });
    }

    /* ================= JOB FETCH ================= */
    let jobText = "";

    // jobId case
    if (req.body.jobId) {
      const job = await Job.findById(req.body.jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      jobText = job.position;
    }

    // direct text case
    if (req.body.jobText) {
      jobText = req.body.jobText;
    }

    if (!jobText) {
      return res.status(400).json({ message: "Job data missing" });
    }

    /* ================= MATCH LOGIC ================= */

    const resumeWords = resumeText.toLowerCase().split(/\W+/);
    const jobWords = jobText.toLowerCase().split(/\W+/);

    const uniqueJobWords = [...new Set(jobWords)];

    const matched = uniqueJobWords.filter(word =>
      resumeWords.includes(word)
    );

    const score = ((matched.length / uniqueJobWords.length) * 100).toFixed(1);

    res.json({
      score,
      matchedSkills: matched.slice(0, 10),
      missingSkills: uniqueJobWords
        .filter(word => !resumeWords.includes(word))
        .slice(0, 10)
    });

  } catch (error) {
    console.log("AI ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};