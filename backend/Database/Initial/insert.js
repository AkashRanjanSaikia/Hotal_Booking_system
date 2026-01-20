const mongoose = require("mongoose");
const Listing = require("./Schema.js");
const sampleListings = require("./sampleListingsUpdated.js");



mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected!");

    // Insert new sample data
    await Listing.insertMany(sampleListings);

    console.log("Sample listings inserted!");
    mongoose.connection.close();
  })  
  .catch((err) => console.error(err));
