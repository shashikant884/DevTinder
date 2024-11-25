const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");



app.use(express.json());
app.post("/signup" , async (req , res)=>{
    const user = new User(req.body);
    // console.log(req.body);
    // const user = new User({
    //     firstName : "Rohit",
    //     lastName : "Sharma",
    //     emailId : "Rohit@123.com",
    //     password : "Rohit@123"
    // });
    try{
        await user.save();
        res.send("User add successfully");
    }catch(err){
        res.status(400).send("Error saveing the user" + err);
    }
} );

app.get("/user" , async(req , res)=>{
    const userEmail = req.body.emailId;

    try{
        console.log(userEmail);
        const user = await User.findOne({emailId : userEmail});

        if(!user){
            res.status(404).send("User not found");
        }else{
            res.send(user);
        }
    }catch{
        res.status(400).send("Error saveing the user");
    }
});

app.get("/feed" , async(req , res)=>{
    try{
        const user = await User.find({});
        res.send(user);
        console.log(user);
    }catch{
        res.status(400).send("Some think went wrong");
    }
});

app.delete("/user" , async(req , res)=>{
    const userId = req.body.userId;
    console.log(userId);
        try{
            const user = await User.findByIdAndDelete(userId);
            res.send("User Deleted successfully");
        }catch(err){
                res.status(400).send("Some think went wrong");
       }   
});

app.patch("/user" , async(req , res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({_id: userId} , data , {
            returnDocument : "after",
            runValidators : true
        });
        console.log(user);
        res.send("User update successfully"); 

    }catch(err){
        // res.status(400).send("somethink went wrong");
        res.status(400).send("Update failed" + err);
    }
});

connectDB().then(()=>{
    console.log("Database Connection established ....... ");
    app.listen(7777 , ()=>{
        console.log("Server is successfully listening on port 7777");

    });
})
.catch((err)=>{
    console.error("Database connot be connected");
});

