const User = require("../models/User");
const { signToken } = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.create({ name, email, password });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const match = password === user.password;
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      goals: {
        study: req.user.goalStudyHours ?? 0,
        screen: req.user.goalScreenTimeMax ?? 0,
        sleep: req.user.goalSleepHours ?? 0,
        exercise: req.user.goalExerciseMinutes ?? 0,
      },
    },
  });
};

const updateGoals = async (req, res, next) => {
  try {
    const {
      goalStudyHours,
      goalScreenTimeMax,
      goalSleepHours,
      goalExerciseMinutes,
    } = req.body;

    const applyGoal = (value, fallback) => {
      if (value === undefined || value === null || value === "") {
        return fallback;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    req.user.goalStudyHours = applyGoal(goalStudyHours, req.user.goalStudyHours);
    req.user.goalScreenTimeMax = applyGoal(
      goalScreenTimeMax,
      req.user.goalScreenTimeMax
    );
    req.user.goalSleepHours = applyGoal(goalSleepHours, req.user.goalSleepHours);
    req.user.goalExerciseMinutes = applyGoal(
      goalExerciseMinutes,
      req.user.goalExerciseMinutes
    );
    await req.user.save();
    res.json({
      message: "Goals updated",
      goals: {
        study: req.user.goalStudyHours ?? 0,
        screen: req.user.goalScreenTimeMax ?? 0,
        sleep: req.user.goalSleepHours ?? 0,
        exercise: req.user.goalExerciseMinutes ?? 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateGoals };
