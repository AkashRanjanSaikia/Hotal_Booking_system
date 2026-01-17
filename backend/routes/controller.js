const mongoose = require("mongoose");
const Listing = require("../Database/Models/listing");
const Booking = require("../Database/Models/bookings");
const User = require("../Database/Models/user");


// Get all listings
exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate({
      path: "reviews.user",
      select: "name",
    });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new listing
exports.createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      country,
      mainImage,
      images,
    } = req.body;

    const defaultOwnerId = new mongoose.Types.ObjectId("672b8f64b23f9f2a1c3e4d77");
    const ownerId = req.body.ownerId || defaultOwnerId;

    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      mainImage,
      images,
      owner: ownerId,
    });


    // ✅ Save listing
    await newListing.save();

    res.status(201).json({
      message: "Listing created successfully",
      listing: newListing,
    });
  } catch (err) {
    console.error("❌ Error creating listing:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.myHotels = async (req, res) => {
  try {
    const { userId } = req.query; // or req.params.userId if passed as URL param
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const listings = await Listing.find({ owner: userId });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Create a new booking
exports.newBooking = async (req, res) => {
  try {
    const { hotelId, userName, userEmail, checkIn, checkOut } = req.body;

    const hotel = await Listing.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const nights =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24);

    const totalPrice = nights * hotel.price;

    const booking = new Booking({
      hotel: hotel._id,
      userName,
      userEmail,
      checkIn,
      checkOut,
      totalPrice,
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};

exports.favouriteListing = async (req, res) => {
  console.log("working");
  try {
    const { userId, listingId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.favourites.includes(listingId)) {
      return res.status(400).json({ message: "Listing already favourited" });
    }

    user.favourites.push(listingId);
    await user.save();

    res.status(200).json({ message: "Listing favourited successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Favouriting failed", error: err.message });
  }
};

exports.unfavouriteListing = async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favourites: listingId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Listing removed from favourites" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unfavouriting failed", error: err.message });
  }
};

exports.favouriteHotels = async (req, res) => {
  console.log("working favourites");
  try {
    const { userId } = req.query;

    const user = await User.findById(userId).populate("favourites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ favourites: user.favourites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Retrieving favourites failed", error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found in token" });
    }

    const bookings = await Booking.find({ userEmail }).populate("hotel");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, country, mainImage } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (typeof title === "string") listing.title = title;
    if (typeof description === "string") listing.description = description;
    if (typeof price === "number") listing.price = price;
    if (typeof location === "string") listing.location = location;
    if (typeof country === "string") listing.country = country;
    if (mainImage) listing.mainImage = mainImage;

    await listing.save();

    res.status(200).json({ message: "Listing updated successfully", listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update listing", error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, userId } = req.body;

    if (!userId || !rating) {
      return res
        .status(400)
        .json({ message: "User and rating are required for a review" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    listing.reviews.push({
      user: user._id,
      rating,
      comment,
    });

    await listing.save();

    const populated = await Listing.findById(id).populate({
      path: "reviews.user",
      select: "name",
    });

    res
      .status(201)
      .json({ message: "Review added successfully", listing: populated });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to add review", error: err.message });
  }
};
