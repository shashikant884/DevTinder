const express = require("express");
const requsetRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestSchema")
const User = require("../models/user");
requsetRouter.post("/request/send/:status/:toUserId",
    userAuth , 
    async(req , res)=>{
    try{    
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allpwedStatusType = ["ignored", "interested"];
        if(!allpwedStatusType.includes(status)){
            return res.status(400).json({
                message : "Invalid Status type : " + status });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId, toUserId},
                {fromUserId : toUserId , toUserId : fromUserId},
            ],
        });
        if(existingConnectionRequest){
            return res.status(400).json({
                message : "Connection requset already exists!!"
            });
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({
                message : "User not found"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, 
            toUserId,
            status,
        });
        
        const data = await connectionRequest.save();

        res.json({
            message : "Connection Requset sent successfuly",
            data,
        });
     
    }catch(err){
        res.status(400).send("Error : " + err);
    }
});


module.exports = requsetRouter;  