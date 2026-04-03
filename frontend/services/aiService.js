import { API_BASE_URL, request } from "../lib/api";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseExpiryDateToTimestamp(expiryDate) {
  return new Date(`${expiryDate}T23:59:59`).getTime();
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
  const normalized = (notes || "").toLowerCase();
  if (!normalized) {
    return 0;
  }
  if (/(fridge|refrigerat|cold storage|chiller|frozen|freezer)/.test(normalized)) {
    return 2;
  }
  return 0;
}

function buildLocalSafetyResult({ foodName, expiryDate, originalPrice, notes }) {
  const now = Date.now();
  const expiryTimestamp = parseExpiryDateToTimestamp(expiryDate);
  const hoursToExpiry = (expiryTimestamp - now) / (1000 * 60 * 60);
  const safeHoursLeft = Math.max(0, hoursToExpiry);
  const isSafe = safeHoursLeft > 0;

  let baseDiscount = getDiscountByHoursToExpiry(Math.max(0, hoursToExpiry));
  baseDiscount = clamp(baseDiscount - getStorageDiscountBonus(notes), 20, 90);

  const expectedSellPrice = Number(
    (Number(originalPrice || 0) * (1 - baseDiscount / 100)).toFixed(2)
  );

  let spoilageRisk = "Low";
  if (!isSafe) {
    spoilageRisk = "High";
  } else if (safeHoursLeft <= 24) {
    spoilageRisk = "Medium";
  }

  let urgency = "Low";
  if (!isSafe) {
    urgency = "Do Not Donate";
  } else if (safeHoursLeft <= 24) {
    urgency = "High";
  } else if (safeHoursLeft <= 72) {
    urgency = "Medium";
  }

  return {
    isSafe,
    status: isSafe ? "Safe" : "Unsafe",
    detectedFoodName: foodName,
    spoilageRisk,
    estimatedExpiryHours: Number(safeHoursLeft.toFixed(1)),
    estimatedExpiryAt: new Date(expiryTimestamp).toISOString(),
    confidence: 0.64,
    urgency,
    expectedSellPrice,
    suggestedDiscountPercent: baseDiscount,
    source: "local-fallback",
    reason: isSafe
      ? "Estimated safe using expiry date and storage note."
      : "Item appears expired based on provided expiry date.",
  };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fullDataUrl = String(reader.result || "");
      const parts = fullDataUrl.split(",");
      if (parts.length < 2) {
        reject(new Error("Unable to read image file."));
        return;
      }
      resolve(parts[1]);
    };
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

export async function checkFoodSafety({
  imageFile,
  foodName,
  expiryDate,
  originalPrice,
  category,
  notes,
}) {
  if (!foodName || !expiryDate || !originalPrice) {
    throw new Error("Item name, expiry date, and original price are required for AI check.");
  }

  if (!API_BASE_URL) {
    return buildLocalSafetyResult({ foodName, expiryDate, originalPrice, notes });
  }

  try {
    let imageBase64 = null;
    if (imageFile) {
      imageBase64 = await fileToBase64(imageFile);
    }

    const payload = {
      foodName,
      expiryDate,
      originalPrice: Number(originalPrice),
      category: category || "",
      notes: notes || "",
      imageMimeType: imageFile?.type || "image/jpeg",
      imageBase64,
    };

    const response = await request("/ai/check-food-safety", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return {
      isSafe: Boolean(response?.isSafe),
      status: response?.isSafe ? "Safe" : "Unsafe",
      spoilageRisk: response?.spoilageRisk || "Unknown",
      estimatedExpiryHours: response?.estimatedExpiryHours ?? null,
      estimatedExpiryAt: response?.estimatedExpiryAt || null,
      confidence: response?.confidence ?? null,
      urgency: response?.urgency || "Unknown",
      reason: response?.reason || "AI assessment completed.",
      expectedSellPrice: response?.expectedSellPrice ?? null,
      suggestedDiscountPercent: response?.suggestedDiscountPercent ?? null,
      detectedFoodName: response?.detectedFoodName || foodName,
      source: response?.source || "backend-ai",
    };
  } catch (error) {
    return buildLocalSafetyResult({ foodName, expiryDate, originalPrice, notes });
  }
}
