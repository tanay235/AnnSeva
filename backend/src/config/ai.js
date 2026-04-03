const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function requestGeminiFoodSafetyAnalysis({
  foodName,
  category,
  expiryDate,
  originalPrice,
  notes,
  imageBase64,
  imageMimeType,
  nowIsoString,
}) {
  if (!GEMINI_API_KEY) {
    const error = new Error("Gemini API key is not configured.");
    error.status = 500;
    throw error;
  }

  const prompt = `
You are a packaged-item safety and pricing assistant for donation logistics in India.
Return only strict JSON (no markdown or code fences).

Input:
- Item Name: ${foodName || ""}
- Category: ${category || ""}
- Expiry Date (local): ${expiryDate || ""}
- Original Price INR: ${originalPrice || ""}
- Current Time (local): ${nowIsoString || ""}
- Storage Notes: ${notes || ""}

Tasks:
1) Identify or confirm the item name.
2) Estimate spoilage risk and urgency using expiry date.
3) Suggest discount % based on time-to-expiry and condition notes.
4) Estimate expected sell price in INR from original price and suggested discount.
5) Provide reason.

JSON schema:
{
  "detectedFoodName": "string",
  "suggestedDiscountPercent": number,
  "expectedSellPrice": number,
  "spoilageRisk": "Low|Medium|High",
  "urgency": "Low|Medium|High|Do Not Donate",
  "confidence": number,
  "reason": "string"
}
`.trim();

  const parts = [{ text: prompt }];
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: imageMimeType || "image/jpeg",
        data: imageBase64,
      },
    });
  }

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload?.error?.message || "Gemini request failed.");
    error.status = response.status;
    throw error;
  }

  return payload;
}

module.exports = {
  requestGeminiFoodSafetyAnalysis,
};