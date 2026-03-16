import Post from "../models/Post.js";

/* --------------------------------
   POST CONTROLLERS
--------------------------------*/

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, content, published } = req.body;

    const image = req.file?.path || "";

    const post = new Post({
      title,
      content,
      image,
      author: req.admin._id,
      published: published ?? true,
    });

    await post.save();

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

  post.published = req.body.published ?? post.published;

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
