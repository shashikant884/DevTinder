const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const user = require("./models/user");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const {userAuth}  = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
    try {
      // Validation of data
      validateSignUpData(req);
  
      const { firstName, lastName, emailId, password } = req.body;
  
      // Encrypt the password
      const passwordHash = await bcrypt.hash(password, 10);
      console.log(passwordHash);
  
      //   Creating a new instance of the User model
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
  
      await user.save();
      res.send("User Added successfully!");
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });

app.post("/login" , async(req , res)=>{
    try{

    const {emailId , password} = req.body;
    const user = await User.findOne({emailId : emailId});
    if(!user){
        throw new Error("Invalid credentials Email");
    }
    // const isPasswordValid = await bcrypt.compare(password , user.password);
    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){
        const token = await user.getJWT();

        // const token = await jwt.sign({_id : user._id} , "DEV@Tinder$790" , {
        //     expiresIn : "8d"
        // });
        res.cookie("token" , token , {
            expires : new Date(Date.now() + 8*36000000),
        });
        res.send("Login successful!!!");
    }else{
        throw new Error("Invalid credentials password");
    }
}catch(err){
    res.status(400).send("Error" + err);
}
})  

app.get("/profile" , userAuth, async (req , res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error : " + err);
    }
});

app.post("/sendConnectionRequest" , userAuth ,  (req , res)=>{
    try{
        const user = req.user;

        console.log("Sending a connection requset");

        res.send(user.firstName + " send the connection requset ");
    }catch(err){
        res.status(400).send("Error : " + err);
    }
});

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

app.patch("/user/:userId" , async(req , res)=>{
    const userId = req.params.userId;
    const data = req.body;
    try{

        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "skills",
            "age",
         ];
        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not allowed" );
        }
        if(data?.skills.length > 10){
            throw new Error("Skills can not be more then 10");
        }

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

