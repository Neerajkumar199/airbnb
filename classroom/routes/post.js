const express = require("express");
const router = express.Router();



// <------POST ROUTE ------>

// Index 
router.get("/",(req,res)=>{
       res.send("GET for show posts");
});

// show 
router.get("/:id",(req,res)=>{
       res.send("GET for show posts");
});

//Post 

router.post("/",(req,res)=>{
       res.send("POST for posts");
});

// Delete 
router.delete("/:id",(req,res)=>{
       res.send("DELETE for posts id ");
});


module.exports = router;