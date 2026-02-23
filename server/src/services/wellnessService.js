const WellnessEntry = require("../models/WellnessEntry");
const dayjs = require("dayjs");
const { generateRecommendations } = require("./recommendationService");

const normalizeDate = (rawDate) => {
  const dateStr = String(rawDate || "").trim();
  if (!dateStr) {
    const error = new Error("Date is required");
    error.status = 400;
    throw error;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  const parsed = dayjs(dateStr);
  if (parsed.isValid()) {
    return parsed.format("YYYY-MM-DD");
  }

  const error = new Error("Invalid date format");
  error.status = 400;
  throw error;
};

const buildEntryPayload = async ({ goals, payload }) => {
  const studyHours = Number(payload.studyHours);
  const screenTime = Number(payload.screenTime);
  const sleepHours = Number(payload.sleepHours);
  const exerciseMinutes = Number(payload.exerciseMinutes);
  const date = normalizeDate(payload.date);

  const recommendations = generateRecommendations({
    entry: {
      studyHours,
      screenTime,
      sleepHours,
      exerciseMinutes,
    },
    goals,
  });

  return {
    studyHours,
    screenTime,
    sleepHours,
    exerciseMinutes,
    date,
    recommendations,
  };
};

const createOrUpdateEntry = async ({ userId, goals, payload }) => {
  const normalizedPayload = { ...payload, date: normalizeDate(payload.date) };
  const entryPayload = await buildEntryPayload({ goals, payload: normalizedPayload });
  const existing = await WellnessEntry.findOne({ userId, date: normalizedPayload.date });

  if (existing) {
    existing.set(entryPayload);
    return existing.save();
  }

  return WellnessEntry.create({ userId, ...entryPayload });
};

module.exports = { createOrUpdateEntry };
