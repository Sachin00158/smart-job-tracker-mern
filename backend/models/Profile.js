import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  skills: String,
  experience: String,
  role: String,
  bio: String
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);