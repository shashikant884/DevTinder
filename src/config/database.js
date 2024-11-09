const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect(
        "mongodb+srv://shashikant:Shashi%40884@namastedev.gjivz.mongodb.net/devTinder"
    );
};


module.exports = connectDB;