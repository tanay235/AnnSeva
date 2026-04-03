const listings = [];

function createListing(payload) {
  if (!payload?.aiResult) {
    const error = new Error("Item cannot be published before AI price suggestion.");
    error.status = 400;
    throw error;
  }

  const listing = {
    id: payload.id || `food_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
    foodName: payload.foodName,
    quantity: Number(payload.quantity),
    category: payload.category || "",
    expiryDate: payload.expiryDate,
    originalPrice: Number(payload.originalPrice),
    yourPrice: Number(payload.yourPrice),
    location: payload.location,
    notes: payload.notes || "",
    imageName: payload.imageName || "",
    aiResult: payload.aiResult,
    status: "Available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  listings.unshift(listing);
  return listing;
}

function listListings() {
  return listings;
}

function getListingById(id) {
  return listings.find(item => item.id === id) || null;
}

module.exports = {
  createListing,
  listListings,
  getListingById,
};
