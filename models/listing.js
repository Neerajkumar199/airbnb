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
    default: "listing_image"
  },
  url: {
    type: String,
    default: "/css/default_img.jpg", 
    set: (v) => v === "" ? "/css/default_img.jpg" : v
  }
},
  price: Number,
  location: String,
  country: String,
  reviews :[
    {
      type : Schema.Types.ObjectId,
      ref :"Review",

    }
  ]
}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;




 