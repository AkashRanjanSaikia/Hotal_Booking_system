const express = require("express");
const router = express.Router();
const {
  getAllListings,
  getListingById,
  createListing,
  myHotels,
  favouriteListing,
} = require("./controller");

// GET the hotals created by the user
router.get("/my-hotels", myHotels);

// GET a single listing by ID
router.get("/:id", getListingById);

// GET all listings
router.get("/", getAllListings);

// POST a new listing
router.post("/create", createListing);

router.post("/:id/favourite", favouriteListing);

module.exports = router;
