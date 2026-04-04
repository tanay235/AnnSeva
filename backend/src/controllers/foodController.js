const {
  createListing,
  listListings,
  getListingById,
  deleteListing,
} = require("../services/foodService");

async function createFoodListing(req, res, next) {
  try {
    const { foodName, quantity, expiryDate, originalPrice, location, aiResult, yourPrice } =
      req.body || {};

    if (!foodName || !quantity || !expiryDate || !originalPrice || !location) {
      return res.status(400).json({
        message: "foodName, quantity, expiryDate, originalPrice and location are required.",
      });
    }

    if (!aiResult) {
      return res.status(400).json({
        message: "Publish blocked: run price suggestion first.",
      });
    }

    if (!yourPrice || Number(yourPrice) <= 0) {
      return res.status(400).json({
        message: "yourPrice is required and must be greater than 0.",
      });
    }

    const listing = await createListing({ ...req.body, sellerId: req.user.id });
    return res.status(201).json(listing);
  } catch (error) {
    return next(error);
  }
}

async function getFoodListings(_req, res, next) {
  try {
    const listings = await listListings();
    return res.status(200).json(listings);
  } catch (error) {
    return next(error);
  }
}

async function getFoodListingById(req, res, next) {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }
    return res.status(200).json(listing);
  } catch (error) {
    return next(error);
  }
}

async function getMyFoodListings(req, res, next) {
  try {
    const listings = await listListings({ sellerId: req.user.id });
    return res.status(200).json(listings);
  } catch (error) {
    return next(error);
  }
}

async function getNearbyFoodListings(req, res, next) {
  try {
    // For now, listing all active since we might not have user location stored
    // or passed in the request header/params. 
    // We'll return the standard list, ensuring it's sorted by newest.
    const listings = await listListings({ status: 'active' });
    return res.status(200).json(listings);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createFoodListing,
  getFoodListings,
  getFoodListingById,
  getMyFoodListings,
  getNearbyFoodListings,
  deleteFoodListing,
};

async function deleteFoodListing(req, res, next) {
  try {
    const { id } = req.params;
    console.log(`[DeleteFoodListing] Attempting to delete: ${id} by User: ${req.user?._id || req.user?.id}`);
    
    // Ensure we are passing strings for comparison
    const userId = req.user?._id?.toString() || req.user?.id?.toString();
    
    if (!userId) {
      return res.status(401).json({ message: "User context missing." });
    }

    await deleteListing(id, userId);
    return res.status(200).json({ message: "Listing deleted successfully." });
  } catch (error) {
    console.error(`[DeleteFoodListing] Error:`, error.message);
    return next(error);
  }
}
