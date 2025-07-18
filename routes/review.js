const express = require("express");
const router = express.Router({ mergeParams: true }); // Needed to access `:id` from parent route

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// ✅ FIXED: Import isReviewAuthor
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// ✅ POST route to create a review for a listing
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview )
);

// ✅ DELETE route to remove a review from a listing
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor, // ✅ FIXED: Correct middleware name
  wrapAsync(reviewController.destroyReview )
);

module.exports = router;
