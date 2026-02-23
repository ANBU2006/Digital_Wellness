const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
  getAnalytics,
} = require("../controllers/wellnessController");

const router = express.Router();

router.use(authMiddleware);
router.post("/", createEntry);
router.get("/", getEntries);
router.get("/analytics", getAnalytics);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

module.exports = router;
