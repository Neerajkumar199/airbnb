const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js"); // adjust path if needed

const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
app.use(express.static('public'));
const path = require("path");
const methodOverride = require("method-override");
const { rmSync } = require("fs");

const listings = require("./routes/listing.js");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


app.set("view engine ","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/", (req, res) => {
  res.send("Hi , I am root");
});

//Middleware 
const validateListing = (req,res,next)=>{
      let {error} = listingSchema.validate(req.body);
      
        if(error){
          let errMsg = error.details.map((el)=> el.message).join(","); 
          throw new ExpressError(400,errMsg);
        }else{
          next();
        }
  
}

const validateReview = (req,res,next)=>{
       let {error} = reviewSchema.validate(req.body);
      
        if(error){
          let errMsg = error.details.map((el)=> el.message).join(","); 
          throw new ExpressError(400,errMsg);
        }else{
          next();
        }
  
}

app.use("/listings",listings);
//Reviews Route => Post Route created 

app.post(
  '/listings/:id/reviews',
  validateReview,     // 🧨 Most likely this is failing
  wrapAsync(async (req, res) => {
    try {
      console.log("Request body:", req.body); // Should show data like { rating: '5', comment: 'nice' }

      const { rating, comment } = req.body;

      if (!rating || !comment) {
        return res.status(400).send("Rating and comment are required.");
      }

      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return res.status(404).send("Listing not found");
      }

      const review = new Review({ rating, comment });
      listing.reviews.push(review);

      await review.save();
      await listing.save();

      res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      console.error("💥 Server Error:", err.message);
      res.status(500).send("Internal Server Error: " + err.message);
    }
  })
);


// Delete Review Route 

app.delete("/listings/:listingId/reviews/:reviewId", async (req, res) => {
    const { listingId, reviewId } = req.params;
    
    // Remove the review reference from the listing's reviews array
    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });

    // Delete the review itself
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${listingId}`);
});


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute , Goa",
//     Country: "India"
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing ");
// });


// <-------THis error check after project completion ------>


// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found!"));
// });



app.use((err,req,res,next)=>{
  let{statusCode = 500 , message = "Something went wrong!"} = err;
  // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});


