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

    const missing = uniqueJobWords
      .filter(word => !resumeWords.includes(word));

    /* ================= 🔥 AI SUGGESTIONS (NEW) ================= */

    const suggestions = [];

    if (missing.length > 0) {
      suggestions.push(`Add keywords like ${missing.slice(0, 5).join(", ")}`);
    }

    if (score < 50) {
      suggestions.push("Improve resume by adding relevant projects");
    }

    if (score < 70) {
      suggestions.push("Use more job-specific keywords");
    }

    if (matched.length < 5) {
      suggestions.push("Highlight more technical skills in your resume");
    }

    /* ================= RESPONSE ================= */

    return res.json({
      score,
      matchedSkills: matched.slice(0, 10),
      missingSkills: missing.slice(0, 10),
      suggestions // 🔥 NEW FIELD
    });

  } catch (error) {
    console.log("🔥 FINAL ERROR:", error);

    return res.status(500).json({
      message: "Server crashed"
    });
  }
};