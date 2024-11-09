const express = require("express");

const app = express();






app.get("/user" , (req , res , next)=>{
    console.log("Handling the route 1");
    // res.send("respons 1");
    next();
},

(req , res , next)=>{
    console.log("Handling the route 2");
    // res.send("response 2");
    next();
},
(req , res , next)=>{
    console.log("Handling the route 3");
    res.send("response 3");
    next();
}
);



app.listen(7777)