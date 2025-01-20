const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const forgetPassword = require("../controller/userController");
authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials Email");
    }
    // const isPasswordValid = await bcrypt.compare(password , user.password);
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      // const token = await jwt.sign({_id : user._id} , "DEV@Tinder$790" , {
      //     expiresIn : "8d"
      // });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials password");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful!!");
});

authRouter.post("forget-password", async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).send({ message: "Please provied valid Email" });
    }
    const checkUser = await User.findONe({ emailId });
    if (!checkUser) {
      return res.status(400).send("User not found please register");
    }

    const token = jwt.sign({ emailId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const receiver = {
      from: "tindersupport@gmail.com",
      to: emailId,
      subject: "Password reset request",
      text: `Click on this link to generate new password ${process.env.CLIENT_URL}/reset-password ${token}`,
    };
    await transporter.sendMail(receiver);
    return res
      .status(200)
      .send({ message: "Password reset link send successfully" });
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

module.exports = authRouter;
