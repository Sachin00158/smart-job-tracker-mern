const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


// LOAD ENV FIRST
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

// THEN connect DB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
const jobRoutes = require("./routes/jobRoutes");
app.use("/api/jobs", jobRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Smart Job Tracker API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});