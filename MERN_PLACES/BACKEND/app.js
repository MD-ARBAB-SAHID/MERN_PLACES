const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");


const placeRouters = require("./routes/places-routes");
const userRouters = require("./routes/users-routes")
app.use(express.json())
app.use("/uploads/images",express.static(path.join("uploads","images")));
app.use((req,res,next)=>{
    
    res.setHeader('Access-Control-Allow-Origin',"*");

    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");

    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE")
    
    next();
})

app.use("/api/places",placeRouters);

app.use("/api/users",userRouters)



app.use((req,res,next)=>{
    next(new HttpError("Could not find",404));

})



app.use((error,req,res,next)=>{

    if(req.file){
        fs.unlink(req.file.path,(err)=>{
      
        })
    }
    if(!res.headerSent)
    {
         next(error);
    }
    res.status(error.code || 500).json({message:error.message || "Something went wrong"});
    
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrnsx.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`).then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log("Running at port 5000")
    })
}).catch((err)=>{
    console.log(err);
})



