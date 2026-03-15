import Post from "../models/Post.js";

/* --------------------------------
   POST CONTROLLERS
--------------------------------*/

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file?.path || "";

    const post = new Post({ title, content, image });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* --------------------------------
   GET/UPDATE/DELETE CONTROLLERS
--------------------------------*/

// Get all posts
export const getPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
};

// Get post by id
export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
};

// Update post
export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  if (req.file?.path) post.image = req.file.path;

  await post.save();
  res.json(post);
};

// Delete post
export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  await post.remove();
  res.json({ message: "Post removed" });
};
