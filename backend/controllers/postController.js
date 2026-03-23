import Post from "../models/Post.js";
import { cloudinary } from "../config/cloudinary.js";

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, content, published } = req.body;

    const imageObj = req.file
      ? { url: req.file.secure_url, public_id: req.file.public_id } // ← fixed
      : { url: "", public_id: "" };

    const post = new Post({
      title,
      content,
      image: imageObj,
      author: req.admin._id,
      published: published ?? true,
    });

    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (req.file) {
      if (post.image?.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }
      post.image = {
        url: req.file.secure_url, // ← fixed
        public_id: req.file.public_id, // ← fixed
      };
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.published = req.body.published ?? post.published;

    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.image?.public_id) {
      await cloudinary.uploader.destroy(post.image.public_id);
    }

    await post.deleteOne();
    res.json({ success: true, message: "Post removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
