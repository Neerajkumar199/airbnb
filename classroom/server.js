const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// Middleware to parse cookies
// app.use(cookieParser());

//Send Signed Cookie

app.use(cookieParser("secretcode"));
app.get("/getsignedcookie",(req,res)=>{
       res.cookie("made-in","India",{signed:true});
       res.send("signed cookie sent");
});

// Verify Signed Cookie
app.get("/verify",(req,res)=>{
       console.log(req.signedCookies);
       res.send("verified");
});
 

// Routes
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

// Set cookies
app.get("/getcookies", (req, res) => {
    res.cookie("greet", "namaste");
    res.cookie("madeIn", "India");
    res.cookie("name","neeraj");
    res.send("Sent you some cookies!");
});
app.get("/greet",(req,res)=>{
    let {name = "anoymous"} = req.cookies;
    res.send(`Hi ,${name}`);   
})
// Show cookies
app.get("/", (req, res) => {
    console.log("Cookies received:", req.cookies); // ✅ safer than console.dir
    res.send("Hi, I am root!");
});

// Use route modules
app.use("/users", users);
app.use("/posts", posts);

// Start server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
