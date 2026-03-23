import Message from "../models/Message.js";

/**
 * @desc    Submit contact form (Public)
 * @route   POST /api/messages
 */
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newMessage = await Message.create({ name, email, subject, message });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get messages by folder (Admin)
 * @route   GET /api/messages?status=inbox
 */
export const getMessages = async (req, res) => {
  try {
    const { status = "inbox" } = req.query; // Default to inbox if no query
    const messages = await Message.find({ status }).sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Send a reply and move to 'sent' (Admin)
 * @route   POST /api/messages/:id/reply
 */
export const replyToMessage = async (req, res) => {
  try {
    const { replyContent } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) return res.status(404).json({ message: "Message not found" });

    message.replyContent = replyContent;
    message.isReplied = true;
    message.repliedAt = Date.now();
    message.status = "sent"; // Auto-move to sent folder

    await message.save();
    res.json({ success: true, message: "Reply saved and moved to Sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Soft delete (Move to Trash)
 * @route   PATCH /api/messages/:id/trash
 */
export const moveToTrash = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: "trash" },
      { new: true },
    );
    res.json({ success: true, message: "Moved to trash", data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Permanent Delete (Admin)
 * @route   DELETE /api/messages/:id/purge
 */
export const purgeMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Already purged" });
    res.json({ success: true, message: "Message permanently deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
