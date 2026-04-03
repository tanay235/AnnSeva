const {
  createListing,
  listListings,
  getListingById,
} = require("../services/foodService");

function createFoodListing(req, res, next) {
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

    const listing = createListing(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    return next(error);
  }
}

function getFoodListings(_req, res) {
  return res.status(200).json(listListings());
}

function getFoodListingById(req, res) {
  const listing = getListingById(req.params.id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found." });
  }
  return res.status(200).json(listing);
}

module.exports = {
  createFoodListing,
  getFoodListings,
  getFoodListingById,
};
