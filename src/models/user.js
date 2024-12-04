const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minLength: 5,
        MaxLength: 50,
    },
    lastName : {
        type:String,
    },
    emailId:{
        type:String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address " + value);
            }         
        }
    },
    password:{
        type : String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter the strong Password : ");
            }
        }
    },
    age:{
        type:Number,
        min: 18,

    },
    gender:{
        type:String,
        // validate(value){
        //     if(!["male" , "female" , "other"].includes(value)){
        //         throw new Error("Gender Data is not valid");
        //     }
        // }, 
        emum : {
            values : ["male" , "female" , "other"],
            message:   `{VALUES} are not a valid gender`
        }
    },
    photoUrl:{
        type:String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("URL are not valid");
            }
        }
    },
    about:{
        type: String,
        default: "This is a default about of the user",
    },
    skills:{
        type: [String],
    },
    
},
{
    timestamps : true
}
);


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
      expiresIn: "7d",
    });
    return token;
  };

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(
      passwordInputByUser,
      passwordHash
    );
    return isPasswordValid;
  };

module.exports = mongoose.model("Users" , userSchema);