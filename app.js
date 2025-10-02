dotenv.config();

import express from "express";
import dotenv from "dotenv";
import path from "path";
import UserRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js";
import mongoose from 'mongoose';
import blogModel from "./models/blog.js";
import cookieParser from "cookie-parser";
import checkForAuthenticationCookie from "./middleware/authentication.js"

const app=express();
const port=process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("Mongo is connected")})
.catch((e)=>{console.log("Mongo error")})

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))

app.use("/user",UserRouter)
app.use("/blog",blogRouter)
app.get("/", async(req,res)=>{
    const allblogs=await blogModel.find({});
    res.render("home",{
        user:req.user,
        blogs:allblogs
    });
})

app.listen(port,()=>{console.log(`server is connected ${port}`)})