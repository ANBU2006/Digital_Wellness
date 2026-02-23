const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    goalStudyHours: { type: Number, default: 0 },
    goalScreenTimeMax: { type: Number, default: 0 },
    goalSleepHours: { type: Number, default: 0 },
    goalExerciseMinutes: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("User", userSchema);
