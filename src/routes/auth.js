const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
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
  
authRouter.post("/login" , async(req , res)=>{
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
});

authRouter.post("/logout" , async(req , res) =>{
    res.cookie("token" , null , {
        expires : new Date(Date.now()),
    });
    res.send("Logout successful!!");
})


module.exports = authRouter;  