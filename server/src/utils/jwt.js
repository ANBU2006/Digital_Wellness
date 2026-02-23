const jwt = require("jsonwebtoken");

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

module.exports = { signToken };
