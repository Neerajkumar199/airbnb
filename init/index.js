const mongoose =require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

const initDB = async () =>{ 
       await Listing.deleteMany({});
       initdata.data = initdata.data = initdata.data.map((obj)=>({...obj,owner:"687159f9d9bc12cf61aeb17b"}));
       await Listing.insertMany(initdata.data);
       console.log("data was initialized");
} ;


initDB();
