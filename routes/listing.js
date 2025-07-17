const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
  
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");

// Middleware to validate listing input using Joi


// ✅ Index Route - GET /listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// ✅ New Listing Form - GET /listings/new
router.get("/new",isLoggedIn, (req, res) => {
    
    res.render("listings/new.ejs");
});

// ✅ Show Route - GET /listings/:id
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); 
    }

    res.render("listings/show.ejs", { listing });
}));

// ✅ Create Route - POST /listings
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
   
     newListing.owner = req.user._id; 
    await newListing.save();
    req.flash("success" , "New Listing Created!");
    res.redirect("/listings");
}));

// ✅ Edit Form Route - GET /listings/:id/edit
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error" , "Listing you requested for does not exit !");
        res.redirect("/listings"); 
    }
    res.render("listings/edit.ejs", { listing });
}));

// ✅ Update Route - PUT /listings/:id
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Listing Updated !");
    res.redirect(`/listings/${id}`);
}));

// ✅ Delete Route - DELETE /listings/:id
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted !");
    res.redirect("/listings");
}));

module.exports = router;
