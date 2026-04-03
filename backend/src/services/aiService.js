const { requestGeminiFoodSafetyAnalysis } = require("../config/ai");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseExpiryDateToTimestamp(expiryDate) {
  return new Date(`${expiryDate}T23:59:59`).getTime();
}

function parseGeminiJsonFromResponse(payload) {
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }
    try {
      return JSON.parse(match[0]);
    } catch (nestedError) {
      return null;
    }
  }
}

function getRiskAndUrgency(hoursToExpiry) {
  if (hoursToExpiry <= 0) {
    return { spoilageRisk: "High", urgency: "Do Not Donate" };
  }
  if (hoursToExpiry <= 24) {
    return { spoilageRisk: "High", urgency: "High" };
  }
  if (hoursToExpiry <= 72) {
    return { spoilageRisk: "Medium", urgency: "Medium" };
  }
  return { spoilageRisk: "Low", urgency: "Low" };
}

function getDiscountByHoursToExpiry(hoursToExpiry) {
  if (hoursToExpiry <= 24) {
    return 80;
  }
  if (hoursToExpiry <= 72) {
    return 65;
  }
  if (hoursToExpiry <= 168) {
    return 55;
  }
  if (hoursToExpiry <= 720) {
    return 45;
  }
  if (hoursToExpiry <= 2160) {
    return 35;
  }
  return 25;
}

function getStorageDiscountBonus(notes) {
  const normalized = String(notes || "").toLowerCase();
  if (!normalized) {
    return 0;
  }

  if (/(fridge|refrigerat|cold storage|chiller|frozen|freezer)/.test(normalized)) {
    return 2;
  }
  return 0;
}

async function checkFoodSafety({
  foodName,
  expiryDate,
  originalPrice,
  category,
  notes,
  imageBase64,
  imageMimeType,
}) {
  const expiryTimestamp = parseExpiryDateToTimestamp(expiryDate);
  if (Number.isNaN(expiryTimestamp)) {
    const error = new Error("Invalid expiryDate value.");
    error.status = 400;
    throw error;
  }

  const numericOriginalPrice = Number(originalPrice);
  if (!Number.isFinite(numericOriginalPrice) || numericOriginalPrice <= 0) {
    const error = new Error("Invalid originalPrice value.");
    error.status = 400;
    throw error;
  }

  const now = Date.now();
  const hoursToExpiry = (expiryTimestamp - now) / (1000 * 60 * 60);
  const safeHoursLeft = Math.max(0, hoursToExpiry);
  const isSafe = safeHoursLeft > 0;

  let detectedFoodName = foodName;
  let aiDiscountPercent = null;
  let aiExpectedSellPrice = null;
  let aiReason = "";
  let aiConfidence = 0.65;
  let source = "fallback-rules";

  try {
    const rawGeminiResponse = await requestGeminiFoodSafetyAnalysis({
      foodName,
      category,
      expiryDate,
      originalPrice: numericOriginalPrice,
      notes,
      imageBase64,
      imageMimeType,
      nowIsoString: new Date(now).toISOString(),
    });

    const parsed = parseGeminiJsonFromResponse(rawGeminiResponse);
    if (parsed) {
      detectedFoodName = parsed.detectedFoodName || detectedFoodName;
      if (typeof parsed.suggestedDiscountPercent === "number") {
        aiDiscountPercent = clamp(parsed.suggestedDiscountPercent, 5, 90);
      }
      if (typeof parsed.expectedSellPrice === "number") {
        aiExpectedSellPrice = clamp(parsed.expectedSellPrice, 0, numericOriginalPrice);
      }
      if (typeof parsed.confidence === "number") {
        aiConfidence = clamp(parsed.confidence, 0.1, 0.99);
      }
      aiReason = parsed.reason || "";
      source = "gemini";
    }
  } catch (error) {
    source = "fallback-rules";
  }

  const fallbackDiscount = clamp(
    getDiscountByHoursToExpiry(Math.max(0, hoursToExpiry)) - getStorageDiscountBonus(notes),
    20,
    90
  );

  const modelDiscount =
    typeof aiDiscountPercent === "number" ? clamp(aiDiscountPercent, 20, 90) : null;
  const baselineDiscount = getDiscountByHoursToExpiry(Math.max(0, hoursToExpiry));
  let suggestedDiscountPercent =
    modelDiscount !== null ? Math.max(modelDiscount, baselineDiscount) : fallbackDiscount;

  // When Gemini is unavailable, be extra conservative so sell price does not stay too high.
  if (source !== "gemini") {
    suggestedDiscountPercent = clamp(suggestedDiscountPercent + 10, 20, 90);
  }

  const expectedSellPrice =
    typeof aiExpectedSellPrice === "number"
      ? Number(aiExpectedSellPrice.toFixed(2))
      : Number((numericOriginalPrice * (1 - suggestedDiscountPercent / 100)).toFixed(2));

  const { spoilageRisk, urgency } = getRiskAndUrgency(hoursToExpiry);

  const reasonParts = [];
  reasonParts.push(
    `Expiry-driven pricing used: ${Number(Math.max(0, hoursToExpiry).toFixed(1))}h left to expiry.`
  );
  if (notes) {
    reasonParts.push(`Storage notes considered: "${notes}".`);
  }
  if (aiReason) {
    reasonParts.push(aiReason);
  }

  return {
    isSafe,
    status: isSafe ? "Safe" : "Unsafe",
    detectedFoodName,
    spoilageRisk,
    estimatedExpiryHours: Number(safeHoursLeft.toFixed(1)),
    estimatedExpiryAt: new Date(expiryTimestamp).toISOString(),
    confidence: Number(aiConfidence.toFixed(2)),
    urgency,
    suggestedDiscountPercent: Number(suggestedDiscountPercent.toFixed(1)),
    expectedSellPrice,
    originalPrice: numericOriginalPrice,
    source,
    reason: reasonParts.join(" "),
  };
}

module.exports = {
  checkFoodSafety,
};
