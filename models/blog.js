import mongoose, { Schema, model } from "mongoose";

const blogSchema=new Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    coverImage:{type:String,required:true},
    createdBy:{type:Schema.Types.ObjectId,ref:"user"},

},
{timestamps:true});

const blogModel=model("blogs",blogSchema);

export default blogModel;