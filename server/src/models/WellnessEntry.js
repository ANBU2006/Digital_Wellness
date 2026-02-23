const mongoose = require("mongoose");

const wellnessEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studyHours: { type: Number, required: true, min: 0 },
    screenTime: { type: Number, required: true, min: 0 },
    sleepHours: { type: Number, required: true, min: 0 },
    exerciseMinutes: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
    recommendations: [{ type: String }],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

wellnessEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("WellnessEntry", wellnessEntrySchema);
