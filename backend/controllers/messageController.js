import Message from "../models/Message.js";
import mongoose from "mongoose";

// @desc    Send a new message (Contact Form)
// @route   POST /api/messages
// @access  Public
export const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // 1. Validation: Ensure we know who sent it and what they want
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide a name, email, and message content",
    });
  }

  try {
    // 2. Create the message in the database
    const newMessage = await Message.create({
      name,
      email,
      subject: subject || "No Subject", // Default if subject is empty
      message,
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error in sending message:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all messages (For Admin Dashboard)
// @route   GET /api/messages
// @access  Private (Admin only)
export const getMessages = async (req, res) => {
  try {
    // Fetch messages and show the newest ones first
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Error in fetching messages:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private (Admin only)
export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Message not found (Invalid ID)" });
  }

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in deleting message:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
