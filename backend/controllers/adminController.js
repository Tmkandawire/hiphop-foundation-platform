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
  try {
    const { username, password } = req.body;

    // 1. Check if admin exists
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Compare passwords
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Safety check for Environment Variable
    if (!process.env.JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is missing in .env file");
      throw new Error("JWT_SECRET is not defined");
    }

    // 4. Generate the token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 5. Send successful response
    res.json({ token });
  } catch (error) {
    // This will now show up in your backend terminal if something breaks
    console.error("Login Controller Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
/* -------------------------
   Admin Dashboard Stats
-------------------------*/

export const getDashboardStats = async (req, res, next) => {
  try {
    // High-speed parallel fetching
    const [productCount, postCount, messageCount] = await Promise.all([
      Product.countDocuments(),
      Post.countDocuments(),
      Message.countDocuments(),
    ]);

    // This format matches the 'stats' state in your Dashboard.jsx
    res.status(200).json({
      products: productCount,
      posts: postCount,
      messages: messageCount,
    });
  } catch (error) {
    next(error);
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
