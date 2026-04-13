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

      console.log("FILE TYPE:", req.file.mimetype);

      // 🔥 ONLY PDF ALLOWED
      if (!req.file.mimetype.includes("pdf")) {
        return res.status(400).json({
          message: "❌ Please upload PDF only"
        });
      }

      try {
        const buffer = fs.readFileSync(req.file.path);

        const data = await pdfParse(buffer);

        if (!data.text) {
          return res.status(400).json({
            message: "❌ Empty or invalid PDF"
          });
        }

        resumeText = data.text;

      } catch (err) {
        console.log("PDF PARSE ERROR:", err);

        return res.status(400).json({
          message: "❌ Failed to read PDF"
        });
      }
    }

    /* ================= TEXT MODE ================= */
    if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    }

    /* ❌ VALIDATION */
    if (!resumeText || resumeText.trim() === "") {
      return res.status(400).json({
        message: "Resume missing"
      });
    }

    /* ================= JOB ================= */

    let jobText = "";

    if (req.body.jobId) {
      const job = await Job.findById(req.body.jobId);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      jobText = job.position;
    }

    if (req.body.jobText) {
      jobText = req.body.jobText;
    }

    if (!jobText) {
      return res.status(400).json({
        message: "Job data missing"
      });
    }

    /* ================= MATCH ================= */

    const resumeWords = resumeText.toLowerCase().split(/\W+/);
    const jobWords = jobText.toLowerCase().split(/\W+/);

    const uniqueJobWords = [...new Set(jobWords)];

    const matched = uniqueJobWords.filter(word =>
      resumeWords.includes(word)
    );

    const score = ((matched.length / uniqueJobWords.length) * 100).toFixed(1);

    return res.json({
      score,
      matchedSkills: matched.slice(0, 10),
      missingSkills: uniqueJobWords
        .filter(word => !resumeWords.includes(word))
        .slice(0, 10)
    });

  } catch (error) {
    console.log("🔥 FINAL ERROR:", error);

    return res.status(500).json({
      message: "Server crashed"
    });
  }
};