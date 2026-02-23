const WellnessEntry = require("../models/WellnessEntry");

const getUserAnalytics = async (userId) => {
  const entries = await WellnessEntry.find({ userId }).sort({ date: 1 });
  if (!entries.length) {
    return {
      totals: { daysTracked: 0 },
      averages: { study: 0, screen: 0, sleep: 0, exercise: 0 },
      charts: { dates: [], study: [], screen: [], sleep: [] },
      timeDistribution: { study: 0, screen: 0, sleep: 0, exercise: 0 },
    };
  }

  const totals = entries.reduce(
    (acc, entry) => {
      acc.study += entry.studyHours;
      acc.screen += entry.screenTime;
      acc.sleep += entry.sleepHours;
      acc.exercise += entry.exerciseMinutes;
      return acc;
    },
    { study: 0, screen: 0, sleep: 0, exercise: 0 }
  );

  const averages = {
    study: totals.study / entries.length,
    screen: totals.screen / entries.length,
    sleep: totals.sleep / entries.length,
    exercise: totals.exercise / entries.length,
  };

  const charts = {
    dates: entries.map((entry) => entry.date),
    study: entries.map((entry) => entry.studyHours),
    screen: entries.map((entry) => entry.screenTime),
    sleep: entries.map((entry) => entry.sleepHours),
  };

  const timeDistribution = {
    study: totals.study,
    screen: totals.screen,
    sleep: totals.sleep,
    exercise: totals.exercise / 60,
  };

  return {
    totals: { daysTracked: entries.length },
    averages,
    charts,
    timeDistribution,
  };
};

module.exports = { getUserAnalytics };
