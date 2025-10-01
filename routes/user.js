import express from "express";
import UserModel from "../models/user.js";
const UserRouter =express.Router();

UserRouter.get('/signin',(req,res)=>{
    return res.render("signin");
});

UserRouter.get('/signup',(req,res)=>{
    return res.render("signup");
})


UserRouter.post('/signup',async(req,res)=>{
    const {FullName,Email,password}=req.body;
    console.log(req.body)
    await UserModel.create({
      FullName,
      Email,
      password  
    });
    return res.redirect("/");
});

UserRouter.post("/signin", async (req,res)=>{
    const {Email,password}=req.body;
try {
 const token = await UserModel.matchPasswordAndGenrateToken(Email,password);
 return res.cookie("token",token).redirect("/");
} 

catch (error) {
    return res.render("signin",{error:"incorrect Email and password"});
    
}

})

UserRouter.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/")
})


export default UserRouter;