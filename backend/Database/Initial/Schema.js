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

  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: new mongoose.Types.ObjectId("672b8f64b23f9f2a1c3e4d77"),
  },
});

module.exports = mongoose.model("Listing", listingSchema);
