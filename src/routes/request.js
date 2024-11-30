const express = require("express");
const requsetRouter = express.Router();
const {userAuth} = require("../middlewares/auth");


requsetRouter.post("/sendConnectionRequest" , userAuth ,  (req , res)=>{
    try{
        const user = req.user;

        console.log("Sending a connection requset");

        res.send(user.firstName + " send the connection requset ");
    }catch(err){
        res.status(400).send("Error : " + err);
    }
});


module.exports = requsetRouter;  