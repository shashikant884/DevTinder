const express = require("express");

const app = express();

app.get('/' , (req , res)=>{
    res.send("dasbord page....");
});

app.get('/home' , (req , res)=>{
    res.send("Home page....");
});

app.get('/test' , (req , res)=>{
    res.send("Testing pageasdfgh ..");
});

app.listen(7777)