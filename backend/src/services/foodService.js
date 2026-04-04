const Inventory = require('../models/Inventory');
const { notifyNearbyUsers } = require('./notificationService');

async function createListing(payload) {
  if (!payload?.aiResult) {
    const error = new Error("Item cannot be published before AI price suggestion.");
    error.status = 400;
    throw error;
  }

  // Map UI payload to Inventory Model (B2C)
  // payload.location should be: { type: 'Point', coordinates: [lng, lat] }
  
  const listingData = {
    sellerId: payload.sellerId, // Provided by the frontend (from Auth context)
    productName: payload.foodName,
    category: payload.category || 'Other',
    quantityAvailable: Number(payload.quantity),
    unit: payload.unit || 'Units',
    mrpPerUnit: Number(payload.originalPrice),
    expiryDate: new Date(payload.expiryDate),
    listingPrice: Number(payload.yourPrice),
    aiSuggestedPrice: payload.aiResult?.suggestedPrice,
    description: payload.notes || "",
    productImages: payload.imageName ? [payload.imageName] : [],
    location: payload.location, // GeoJSON { type: 'Point', coordinates: [lng, lat] }
    status: 'active'
  };

  const listing = await Inventory.create(listingData);

  // Trigger background geospatial notifications
  notifyNearbyUsers(listing).catch(err => {
    console.error('[Notification Trigger Error]', err.message);
  });

  return listing;
}

async function listListings(filters = {}) {
  // Return all active listings for the Buyer (Customer) Feed
  return await Inventory.find({ status: 'active', ...filters })
    .populate('sellerId', 'organizationName address phoneNumber')
    .sort({ createdAt: -1 });
}

async function getListingById(id) {
  return await Inventory.findById(id).populate('sellerId', 'firstName lastName organizationName address');
}

async function deleteListing(listingId, sellerId) {
  const listing = await Inventory.findById(listingId);
  if (!listing) {
    const error = new Error("Listing not found.");
    error.status = 404;
    throw error;
  }

  // Security check: must be the owner
  if (listing.sellerId.toString() !== sellerId.toString()) {
    const error = new Error("Not authorized to delete this listing.");
    error.status = 403;
    throw error;
  }

  return await Inventory.findByIdAndDelete(listingId);
}

module.exports = {
  createListing,
  listListings,
  getListingById,
  deleteListing,
};
