import express from "express";
import multer from "multer";
import path from "path";
import blogModel from "../models/blog.js";
import commentModel from "../models/comments.js";
const blogRouter=express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
const fileName=`${Date.now()}-${file.originalname}`
cb(null,fileName);
  }
})

const upload = multer({ storage: storage })

blogRouter.get("/add-new",(req,res)=>{
    return res.render("addBlogs",{
        user:req.user,
    });
});

blogRouter.get("/:id", async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id).populate("createdBy");
    const comment=await commentModel.find({blogId:req.params.id}).populate("createdBy");
console.log(comment);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    return res.render("blog", {
      user: req.user,
      blog,
      comment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

blogRouter.post("/comment/:blogId", async(req,res)=>{
  const comment =await commentModel.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id,

  })
    console.log("Created comment:", comment);

  return res.redirect(`/blog/${req.params.blogId}`);
})

blogRouter.post("/",upload.single('coverImage'), async(req,res)=>{
    const {title,body}=req.body;
      const blog= await blogModel.create({
                body,
                title,
                createdBy:req.user._id,
                coverImage:`/uploads/${req.file.filename}`

})
  return res.redirect(`/blog/${blog._id}`);
});

export default blogRouter;