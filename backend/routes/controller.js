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
    const listing = await Listing.findById(req.params.id);
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
