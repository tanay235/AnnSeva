const express = require("express");
const {
  createFoodListing,
  getFoodListings,
  getFoodListingById,
} = require("../controllers/foodController");

const router = express.Router();

router.get("/", getFoodListings);
router.get("/:id", getFoodListingById);
router.post("/", createFoodListing);

module.exports = router;
