const generateRecommendations = ({ entry, goals }) => {
  const recommendations = [];
  const hasGoal = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
  const checks = [
    {
      active: hasGoal(goals.maxScreenTime),
      failed: entry.screenTime > goals.maxScreenTime,
      message:
        "Digital Detox Recommended – Your screen time exceeded your daily limit.",
    },
    {
      active: hasGoal(goals.minSleepHours),
      failed: entry.sleepHours < goals.minSleepHours,
      message:
        "Sleep Improvement Plan Recommended – You are not meeting your sleep target.",
    },
    {
      active: hasGoal(goals.minStudyHours),
      failed: entry.studyHours < goals.minStudyHours,
      message:
        "Structured Study Plan Recommended – Increase focused study time.",
    },
    {
      active: hasGoal(goals.minExerciseMinutes),
      failed: entry.exerciseMinutes < goals.minExerciseMinutes,
      message:
        "Physical Activity Boost Recommended – Add at least 15 minutes of movement.",
    },
  ];

  const activeChecks = checks.filter((rule) => rule.active);
  if (activeChecks.length === 0) {
    recommendations.push("Set your goals to get personalized recommendations.");
    return recommendations;
  }

  activeChecks.forEach((rule) => {
    if (rule.failed) {
      recommendations.push(rule.message);
    }
  });

  if (recommendations.length === 0) {
    recommendations.push(
      "Excellent! You are meeting all your wellness goals today."
    );
  }

  return recommendations;
};

module.exports = { generateRecommendations };
