import Product from "../models/product.js";
import Post from "../models/Post.js";
import Message from "../models/Message.js";
// import User from "../models/User.js"; // Uncomment when you create the User model

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Run multiple database counts in parallel (Industry Standard for speed)
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
        // users: userCount
      },
    });
  } catch (error) {
    console.error("Error in fetching admin stats:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get specific activity logs (Simplified)
// @route   GET /api/admin/activity
// @access  Private/Admin
export const getActivityLogs = async (req, res) => {
  try {
    // Logic to fetch recent system activity
    // For now, we return the most recent 5 messages as "activity"
    const recentMessages = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({ success: true, data: recentMessages });
  } catch (error) {
    console.error("Error in fetching activity logs:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
