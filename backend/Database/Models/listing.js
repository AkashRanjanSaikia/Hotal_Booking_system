// const mongoose = require("mongoose");

// const listingSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   image: {
//     filename: String,
//     url: String,
//   },
//   price: Number,
//   location: String,
//   country: String,
// });

// module.exports = mongoose.model("Listing", listingSchema);

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
    required: true,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      comment: {
        type: String,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Listing", listingSchema);
