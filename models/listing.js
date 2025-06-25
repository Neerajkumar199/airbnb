const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
  filename: {
    type: String,
    default: "listing_image",
  },
  url: {
    type: String,
    default:
      "https://unsplash.com/photos/photo-of-brown-bench-near-swimming-pool-Koei_7yYtIo",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/photo-of-brown-bench-near-swimming-pool-Koei_7yYtIo"
        : v,
  },
},

  price: Number,
  location: String,
  country: String,
}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

