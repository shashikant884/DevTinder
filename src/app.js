const express = require("express");

const app = express();



// app.use('/home' , (req , res)=>{
//     res.send("Home page....");
// });

// app.use('/test' , (req , res)=>{
//     res.send("Test ..");
// });

// app.use('/' , (req , res)=>{
//     res.send("Home page....");
// });

app.get("/user" , (req , res)=>{
    console.log(req.query);
    res.send({FirstName : "Shashikant" , LastName : "Yadav"});
});

app.post("/user" , (req , res)=>{
    res.send("Data saveed.");
});

app.delete("/user" , (req , res)=>{
    res.send("Deleted ");
})



app.listen(7777)