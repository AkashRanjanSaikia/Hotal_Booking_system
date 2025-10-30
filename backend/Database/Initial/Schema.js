const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: String,
  url: String,
});

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  // main (cover) image
  mainImage: imageSchema,

  // multiple extra images
  images: [imageSchema],

  price: {
    type: Number,
    required: true,
  },
  location: String,
  country: String,
});

module.exports = mongoose.model("Listing", listingSchema);
