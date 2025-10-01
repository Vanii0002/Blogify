import express from "express";
import multer from "multer";
import path from "path";
import blogModel from "../models/blog.js";
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
    const blog = await blogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    return res.render("blog", {
      user: req.user,
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

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