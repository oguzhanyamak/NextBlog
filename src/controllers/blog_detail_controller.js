const mongoose = require("mongoose");
const Blog = require("../models/blog_model");
const markdown = require("../config/markdown_it_config");
const renderBlogDetail = async (req, res) => {
  try {
    const { blogId } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(blogId);
    if (!isValidObjectId) {
      return res.render("./pages/404");
    }
    const blogExists = await Blog.exists({
      _id: new mongoose.Types.ObjectId(blogId),
    });
    if (!blogExists) {
      return res.render("./pages/404");
    }
    const blog = await Blog.findById(blogId).populate({
      path: "owner",
      select: "name username profilePhoto",
    });

    const ownerBlogs = await Blog.find({
      owner: blog.owner._id,
    })
      .select("title reaction totalBookmark owner readingTime createdAt")
      .populate({ path: "owner", select: "name username profilePhoto" })
      .where("_id")
      .nin(blogId)
      .sort({ createdAt: -1 })
      .limit(3);

    res.render("./pages/blog_detail", {
      blog,
      ownerBlogs,
      sessionUser: req.session.user,
      markdown,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { renderBlogDetail };
