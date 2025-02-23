"use strict";


const User = require("../models/user_model.js");
const Blog = require("../models/blog_model.js");


const updateReaction = async (req, res) => {
  try {

    if (!req.session.user) return res.sendStatus(401);


    const { username } = req.session.user;


    const { blogId } = req.params;


    const currentUser = await User.findOne({ username }).select("reactedBlogs");

    if (currentUser.reactedBlogs.includes(blogId)) {
      return res.sendStatus(400);
    }

    // Find the blog and update it's reaction count
    const reactedBlog = await Blog.findById(blogId)
      .select("reaction owner")
      .populate({
        path: "owner",
        select: "totalReactions",
      });

    reactedBlog.reaction++;
    await reactedBlog.save();

    currentUser.reactedBlogs.push(reactedBlog._id);
    await currentUser.save();


    reactedBlog.owner.totalReactions++;
    await reactedBlog.owner.save();

    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating reaction: ", error.message);
    throw error;
  }
};



const deleteReaction = async (req, res) => {
  try {

    if (!req.session.user) return res.sendStatus(401);


    const { username } = req.session.user;


    const { blogId } = req.params;


    const currentUser = await User.findOne({ username }).select("reactedBlogs");

    if (!currentUser.reactedBlogs.includes(blogId)) {
      return res.sendStatus(400);
    }


    const reactedBlog = await Blog.findById(blogId)
      .select("reaction owner")
      .populate({
        path: "owner",
        select: "totalReactions",
      });

    reactedBlog.reaction--;
    await reactedBlog.save();


    currentUser.reactedBlogs.splice(
      currentUser.reactedBlogs.indexOf(blogId),
      1
    );
    await currentUser.save();

   
    reactedBlog.owner.totalReactions--;
    await reactedBlog.owner.save();

    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting reaction: ", error.message);
    throw error;
  }
};

module.exports = {
  updateReaction,
  deleteReaction,
};
