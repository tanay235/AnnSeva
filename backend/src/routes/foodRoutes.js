const express = require("express");
const {
  createFoodListing,
  getFoodListings,
  getFoodListingById,
  getMyFoodListings,
  getNearbyFoodListings,
  deleteFoodListing,
} = require("../controllers/foodController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getFoodListings);

// Protected routes
router.post("/", protect, authorize("seller"), createFoodListing);
router.get("/my/listings", protect, authorize("seller"), getMyFoodListings);
router.get("/nearby/deals", protect, getNearbyFoodListings);
router.delete("/:id", protect, authorize("seller"), deleteFoodListing);

// Parameterized routes (MUST be last)
router.get("/:id", getFoodListingById);

module.exports = router;
