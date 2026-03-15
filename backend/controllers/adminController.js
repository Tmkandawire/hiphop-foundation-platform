import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";
import Post from "../models/Post.js";
import Message from "../models/Message.js";

/* -------------------------
   Admin Registration
-------------------------*/

export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  const adminExists = await Admin.findOne({ username });

  if (adminExists) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new Admin({
    username,
    password: hashedPassword,
  });

  await admin.save();

  res.json({ message: "Admin registered successfully" });
};

/* -------------------------
   Admin Login
-------------------------*/

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, admin.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
};

/* -------------------------
   Admin Dashboard Stats
-------------------------*/

export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Run multiple database counts in parallel
    const [productCount, postCount, messageCount] = await Promise.all([
      Product.countDocuments(),
      Post.countDocuments(),
      Message.countDocuments(),
    ]);

    // 2. Return a summary object
    res.status(200).json({
      success: true,
      data: {
        products: productCount,
        posts: postCount,
        messages: messageCount,
      },
    });
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};

/* -------------------------
   Admin Activity Logs
-------------------------*/

export const getActivityLogs = async (req, res, next) => {
  try {
    // Logic to fetch recent system activity
    // For now, we return the most recent 5 messages as "activity"
    const recentMessages = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({ success: true, data: recentMessages });
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};
