import Job from "../models/job.js";

// CREATE JOB
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL JOBS
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE JOB
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE JOB
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// JOB STATS
export const getJobStats = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id });

    let applied = 0;
    let interview = 0;
    let rejected = 0;

    jobs.forEach((job) => {
      if (job.status === "Applied") applied++;
      if (job.status === "Interview") interview++;
      if (job.status === "Rejected") rejected++;
    });

    res.json({
      applied,
      interview,
      rejected
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};