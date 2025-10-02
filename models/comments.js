import mongoose, { Schema, model } from "mongoose";

const commentSchema=new Schema({
   content:{type:String,required:true},
   blogId:{type:Schema.Types.ObjectId,ref:"blog"},
 createdBy:{type:Schema.Types.ObjectId,ref:"user"},
 
},
{timestamps:true}
)


const commentModel=model("comment",commentSchema);

export default commentModel;