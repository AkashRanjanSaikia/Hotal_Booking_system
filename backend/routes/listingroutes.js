const express = require("express");
const router = express.Router();
const {
  getAllListings,
  getListingById,
  createListing,
  myHotels,
  favouriteListing,
  favouriteHotels,
  unfavouriteListing,
  updateListing,
  addReview,
} = require("./controller");
const authMiddleware = require("./middlewares");

// GET the hotals created by the user
router.get("/my-hotels", myHotels);

// GET favourite hotels for a user
router.get("/favourites", favouriteHotels);

// GET a single listing by ID
router.get("/:id", getListingById);

// GET all listings
router.get("/", getAllListings);

// POST a new listing
router.post("/create", createListing);

router.post("/:id/favourite", favouriteListing);
router.delete("/:id/favourite", unfavouriteListing);
router.put("/:id", updateListing);
router.post("/:id/reviews", authMiddleware, addReview);



module.exports = router;
