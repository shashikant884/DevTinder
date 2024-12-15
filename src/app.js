const express = require("express");
const connectDB = require("./config/database");
const app = express();
// const User = require("./models/user");
// const bcrypt = require("bcrypt");
// const user = require("./models/user");
const cookieParser = require("cookie-parser");
// const JWT = require("jsonwebtoken");
// const {userAuth}  = require("./middlewares/auth");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requsetRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser());

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requsetRouter);
app.use("/" , userRouter);

connectDB().then(()=>{
    console.log("Database Connection established ....... ");
    app.listen(7777 , ()=>{
        console.log("Server is successfully listening on port 7777");

    });
})
.catch((err)=>{
    console.error("Database connot be connected");
});

