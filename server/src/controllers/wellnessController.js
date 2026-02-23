const WellnessEntry = require("../models/WellnessEntry");
const { createOrUpdateEntry } = require("../services/wellnessService");
const { getUserAnalytics } = require("../services/analyticsService");

const buildGoalConfig = (user) => ({
  minStudyHours: Number(user.goalStudyHours ?? 0),
  maxScreenTime: Number(user.goalScreenTimeMax ?? 0),
  minSleepHours: Number(user.goalSleepHours ?? 0),
  minExerciseMinutes: Number(user.goalExerciseMinutes ?? 0),
});

const createEntry = async (req, res, next) => {
  try {
    const entry = await createOrUpdateEntry({
      userId: req.user._id,
      goals: buildGoalConfig(req.user),
      payload: req.body,
    });
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

const getEntries = async (req, res, next) => {
  try {
    const entries = await WellnessEntry.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

const updateEntry = async (req, res, next) => {
  try {
    const entry = await WellnessEntry.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    const updated = await createOrUpdateEntry({
      userId: req.user._id,
      goals: buildGoalConfig(req.user),
      payload: { ...req.body, date: entry.date },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteEntry = async (req, res, next) => {
  try {
    const deleted = await WellnessEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted" });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await getUserAnalytics(req.user._id);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

module.exports = { createEntry, getEntries, updateEntry, deleteEntry, getAnalytics };
