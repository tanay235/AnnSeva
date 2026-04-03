const { checkFoodSafety } = require("../services/aiService");

async function runFoodSafetyCheck(req, res, next) {
  try {
    const {
      foodName,
      expiryDate,
      originalPrice,
      category,
      notes,
      imageBase64,
      imageMimeType,
    } = req.body || {};

    if (!foodName || !expiryDate || !originalPrice) {
      return res.status(400).json({
        message: "foodName, expiryDate and originalPrice are required.",
      });
    }

    const result = await checkFoodSafety({
      foodName,
      expiryDate,
      originalPrice,
      category,
      notes,
      imageBase64,
      imageMimeType,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  runFoodSafetyCheck,
};