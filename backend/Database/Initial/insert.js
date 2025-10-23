const mongoose = require("mongoose");
const Listing = require("./Models/");
const sampleListings = require("./data");



mongoose
  .connect("mongodb://127.0.0.1:27017/New_wanderland")
  .then(async () => {
    console.log("MongoDB connected!");

    // Insert new sample data
    await Listing.insertMany(sampleListings);

    console.log("Sample listings inserted!");
    mongoose.connection.close();
  })
  .catch((err) => console.error(err));
