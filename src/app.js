const express = require("express");
const {adminAuth , userAuth} = require("./middlewares/auth");

const app = express();

app.use("/admin" ,adminAuth)

app.get("/user" , userAuth , (req, res )=>{
    res.send("User data send");
});

app.get("/admin/getAllData" , (req , res)=>{
    res.send("All data send");
    }
);
app.get("/admin/delete" , (req , res)=>{
    res.send("All data deleted");
    }
);

app.listen(7777)