import Post from "../models/Post.js";
import mongoose from "mongoose";

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    // Fetch posts and sort by the most recent (industry standard for feeds)
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error in fetching posts:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Public (Will be Private/Auth later)
export const createPost = async (req, res) => {
  const { title, content, author, image, tags } = req.body;

  // 1. Validation: Posts must have a title and content to be meaningful
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Please provide both a title and content for the post",
    });
  }

  try {
    // 2. Create the post using the data from the request body
    const newPost = await Post.create({
      title,
      content,
      author: author || "Anonymous", // Default if no author is provided
      image,
      tags,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error("Error in creating post:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Public
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const postUpdates = req.body;

  // Check if the ID provided matches MongoDB's 24-character hex format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Post not found (Invalid ID)" });
  }

  try {
    // { new: true } returns the document AFTER it has been updated
    const updatedPost = await Post.findByIdAndUpdate(id, postUpdates, {
      new: true,
    });

    if (!updatedPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("Error in updating post:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Public
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Post not found (Invalid ID)" });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Post removed successfully" });
  } catch (error) {
    console.error("Error in deleting post:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
