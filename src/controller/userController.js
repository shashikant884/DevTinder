const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


const forgetPassword = async (req , res )=>{
    try{
        const {emailId} = req.body;

        if(!emailId){
            return res.status(400).send({message :"Please provied valid Email"})
        }
        const checkUser = await User.findONe({emailId});
        if(!checkUser){
            return res.status(400).send("User not found please register");
        }

        const token = jwt.sign({emailId} , process.env.JWT_SECRET_KEY , {expiresIn: "1h"});

        const transporter = nodemailer.createTransport({
            service : "gmail",
            secure : true,
            auth:{
                user: process.env.MY_GMAIL,
                pass: process.env.MY_PASSWORD,
            },
        });
         
        const receiver = {
            from : "tindersupport@gmail.com",
            to : emailId,
            subject : "Password reset request",
            text : `Click on this link to generate new password ${process.env.CLIENT_URL}/reset-password ${token}`,
        };
        await transporter.sendMail(receiver);
        return res.status(200).send({message : "Password reset link send successfully"})
    }catch(err){
        res.status(400).send("Error" + err.message);
    }
}

module.exports = forgetPassword;