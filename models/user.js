import mongoose from "mongoose";
import { createHmac, generateKey, randomBytes } from "crypto";
import Token from "../services/authentication.js"

const UserSchema=new mongoose.Schema({
FullName:{type:String, required:true},
Email:{type:String,required:true,unique:true},
salt:{type:String},
password:{type:String,required:true,unique:true},
profileImage:{type:String,default:"/avatar.png"},
role:{type:String,enum:["USER","ADMIN"],default:"USER"},




},{timestamps:true});

UserSchema.pre("save",function(next)
{
const user=this;
if(!user.isModified("password")) return;

const salt =randomBytes(16).toString("hex");
const hashedPassword =createHmac('sha256',salt)
.update(user.password)
.digest('hex');

this.salt=salt;
this.password=hashedPassword;

next();

}
)

UserSchema.static(
    "matchPasswordAndGenrateToken",
 async function(Email,password){
const user=await this.findOne({Email});
console.log(user);
if(!user) throw new Error("User not found");

const salt =user.salt;
const hashedPassword=user.password;

const userProvidedHash=createHmac('sha256',salt)
.update(password)
.digest('hex');

if(hashedPassword !== userProvidedHash) throw new Error("Incorrect Password");

const token=Token.createTokenForUser(user);
console.log(token);
return token;
})
const UserModel=mongoose.model("user",UserSchema);

export default UserModel;