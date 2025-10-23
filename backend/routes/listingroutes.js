const express = require("express");
const router = express.Router();
const {
  getAllListings,
  getListingById,
  createListing,
} = require("./controller");

// GET all listings
router.get("/", getAllListings);

// GET a single listing by ID
router.get("/:id", getListingById);

// POST a new listing
router.post("/", createListing);


module.exports = router;
