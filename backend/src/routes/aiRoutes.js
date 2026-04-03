const express = require("express");
const { runFoodSafetyCheck } = require("../controllers/aiController");

const router = express.Router();

router.post("/check-food-safety", runFoodSafetyCheck);

module.exports = router;
