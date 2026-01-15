const mongoose = require("mongoose");
const Listing = require("./Schema.js");

async function addDefaultOwner() {
  await mongoose.connect("mongodb://127.0.0.1:27017/CozyStay");
  console.log("✅ MongoDB connected");

  const defaultOwnerId = new mongoose.Types.ObjectId("672b8f64b23f9f2a1c3e4d77"); // <-- replace with real CozyStay user _id

  const result = await Listing.updateMany(
    { owner: { $exists: false } },      // only update those without owner
    { $set: { owner: defaultOwnerId } } // assign CozyStay as owner
  );

  console.log(`🎉 Updated ${result.modifiedCount} listings with default owner CozyStay`);
  mongoose.connection.close();
}

addDefaultOwner();
