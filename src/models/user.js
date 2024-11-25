const mongoose = require("mongoose");

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
    },
    password:{
        type : String,
        required: true,
    },
    age:{
        type:Number,
        min: 18,

    },
    gender:{
        type:String,
        validate(value){
            if(!["male" , "female" , "other"].includes(value)){
                throw new Error("Gender Data is not valid");
            }
        }, 
    },
    photoUrl:{
        type:String,
        default: "https://geographyandyou.com/images/user-profile.png",
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

module.exports = mongoose.model("Users" , userSchema);