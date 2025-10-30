const fs = require("fs");
const path = require("path");
const sampleListings = require("./data");

const extraImages = [
  {
    filename: "extra1",
    url: "https://images.unsplash.com/photo-1680210851458-b7dc5685e06e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
  },
  {
    filename: "extra2",
    url: "https://images.unsplash.com/photo-1697618009092-01b24159a55a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
  },
  {
    filename: "extra3",
    url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
  },
  {
    filename: "extra4",
    url: "",
  },
];

const updatedListings = sampleListings.map((listing) => ({
  ...listing,
  mainImage: listing.image, // preserve the old image as the main one
  images: extraImages, // add 3 extra images
}));

// Remove the old "image" field (optional)
updatedListings.forEach((listing) => {
  delete listing.image;
});

// Convert back to JS file format
const newFileContent = `
const sampleListings = ${JSON.stringify(updatedListings, null, 2)};
module.exports = sampleListings;
`;

// Write to a new file
fs.writeFileSync(path.join(__dirname, "sampleListingsUpdated.js"), newFileContent.trim());
console.log("✅ sampleListingsUpdated.js created successfully!");
