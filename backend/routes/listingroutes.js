const express = require("express");
const router = express.Router();
const authMiddleware = require("./middlewares");
const upload = require("../cloudinary");

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
  deleteListing,
} = require("./controller");


router.get("/my-hotels", myHotels);

router.get("/favourites", favouriteHotels);

router.get("/:id", getListingById);

router.get("/", getAllListings);

router.post(
  "/create",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createListing
);

router.post("/:id/favourite", favouriteListing);
router.delete("/:id/favourite", unfavouriteListing);

router.put("/:id", updateListing);
router.post("/:id/reviews", authMiddleware, addReview);

router.delete("/:id",deleteListing);



module.exports = router;
