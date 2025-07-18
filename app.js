  const express = require("express");
  const app = express();
  const mongoose = require("mongoose");
  const ejsMate = require("ejs-mate");


  const ExpressError = require("./utils/ExpressError.js");
  const session = require("express-session");
  const flash = require("connect-flash");
  const passport = require("passport");
  const LocalStrategy = require("passport-local");
  const User = require("./models/user.js"); 
  const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

  const path = require("path");
  const methodOverride = require("method-override");


  const listingRouter = require("./routes/listing.js");
  const reviewRouter = require("./routes/review.js");
   const userRouter = require("./routes/user.js");
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

 const sessionOptions = {
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie :{
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 *60 *1000,
    httpOnly : true ,
  },

 };
  app.get("/", (req, res) => {
    res.send("Hi , I am root");
  });

 app.use(session(sessionOptions));
 app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in  localStrategy 
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize a nd deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error"); 
    res.locals.currUser = req.user;
    next();
});
 
// app.get("/demouser",async(req, res)=>{
//   let fakeUser = new User ({
//     email : "student@gmail.com",
//     username : "Ravi-kumar",
//   });
//   let registeredUser = await User.register(fakeUser ,"helloworld");
//   res.send(registeredUser);
// });
 



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

  app.use("/listings",listingRouter);
  app.use("/listings/:id/reviews",reviewRouter);
  app.use("/",userRouter);


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


