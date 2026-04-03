import { API_BASE_URL, request } from "../lib/api";

function saveToLocalDraft(listing) {
  if (typeof window === "undefined") {
    return listing;
  }

  const existing = JSON.parse(localStorage.getItem("annseva_food_listings") || "[]");
  const next = [...existing, listing];
  localStorage.setItem("annseva_food_listings", JSON.stringify(next));
  return listing;
}

export async function createFoodListing(payload) {
  if (!payload?.aiResult) {
    throw new Error("Run price suggestion before publishing.");
  }

  const listing = {
    id: payload.id || `food_${Date.now()}`,
    ...payload,
    status: "Available",
    createdAt: new Date().toISOString(),
  };

  if (!API_BASE_URL) {
    return saveToLocalDraft(listing);
  }

  try {
    return await request("/food", {
      method: "POST",
      body: JSON.stringify(listing),
    });
  } catch (error) {
    return saveToLocalDraft(listing);
  }
}
