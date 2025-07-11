const express = require("express");
const app = express();
// Routes
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

const session = require("express-session");
const review = require("../models/review.js");
const flash = require("connect-flash");
const path = require("path");


  app.set("view engine ","ejs");
  app.set("views", path.join(__dirname,"views"));

const sessionOptions = {
       secret : "mysupersecretstring",
       resave : false,
       saveUninitialized : true,
};
app.use(session(sessionOptions));

app.use(flash());
//middleware 
app.use((req,res,next)=>{
         res.locals.successMsg = req.flash("success");
       res.locals.errorMsg = req.flash("error");
       next();

});
app.get("/register",(req,res)=>{
       let {name ="anonymous"} = req.query;
        req.session.name = name ;
       
        if(name === "anonymous"){
              req.flash("error","user not registered");
        }
        else{
               req.flash("success" ,"user registered successfully!");
        }
        res.redirect("/hello");
}); 
app.get("/hello",(req,res)=>{
       res.render("page.ejs", {name: req.session.name} );
});

// app.get("/reqcount",(req,res)=>{
//        if(req.session.count){
//               req.session.count++;
//        }else{
//               req.session.count = 1;
//        }
       
//        res.send(`you sent a request ${req.session.count} times`);
// });


app.get("/test",(req,res)=>{
       res.send("test successful !");
});

// const cookieParser = require("cookie-parser");

// Middleware to parse cookies
// app.use(cookieParser());

//Send Signed Cookie

// app.use(cookieParser("secretcode"));
// app.get("/getsignedcookie",(req,res)=>{
//        res.cookie("made-in","India",{signed:true});
//        res.send("signed cookie sent");
// });

// Verify Signed Cookie
// app.get("/verify",(req,res)=>{
//        console.log(req.signedCookies);
//        res.send("verified");
// });
 



// // Set cookies
// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");
//     res.cookie("madeIn", "India");
//     res.cookie("name","neeraj");
//     res.send("Sent you some cookies!");
// });
// app.get("/greet",(req,res)=>{
//     let {name = "anoymous"} = req.cookies;
//     res.send(`Hi ,${name}`);   
// })
// // Show cookies
// app.get("/", (req, res) => {
//     console.log("Cookies received:", req.cookies); // ✅ safer than console.dir
//     res.send("Hi, I am root!");
// });

// // Use route modules
// app.use("/users", users);
// app.use("/posts", posts);






// Start server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
