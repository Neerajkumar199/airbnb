const express = require("express");
const router = express.Router({ mergeParams: true }); // Needed to access `:id` from parent route

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// ✅ FIXED: Import isReviewAuthor
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

// ✅ POST route to create a review for a listing
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    const { rating, comment } = req.body;
    const review = new Review({ rating, comment });
    review.author = req.user._id;

    listing.reviews.push(review);

    await review.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// ✅ DELETE route to remove a review from a listing
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor, // ✅ FIXED: Correct middleware name
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
