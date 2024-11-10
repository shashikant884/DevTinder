const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");


app.use(express.json());
app.post("/signup" , async (req , res)=>{
    const user = new User(req.body);
    console.log(req.body);
    // const user = new User({
    //     firstName : "Rohit",
    //     lastName : "Sharma",
    //     emailId : "Rohit@123.com",
    //     password : "Rohit@123"
    // });
    try{
        await user.save();
        res.send("User add successfully");
    }catch{
        res.status(400).send("Error saveing the user");
    }
} );


connectDB().then(()=>{
    console.log("Database Connection established ....... ");
    app.listen(7777 , ()=>{
        console.log("Server is successfully listening on port 7777");

    });
})
.catch((err)=>{
    console.error("Database connot be connected");
});

