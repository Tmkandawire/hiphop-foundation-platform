import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, default: "General Inquiry", trim: true },
    message: { type: String, required: true },
    // 🟢 Folder Management
    status: {
      type: String,
      enum: ["inbox", "sent", "trash"],
      default: "inbox",
    },
    // 🟢 Reply Tracking
    isReplied: { type: Boolean, default: false },
    replyContent: { type: String },
    repliedAt: { type: Date },
  },
  { timestamps: true },
);

// Indexing for performance in large inboxes
messageSchema.index({ status: 1, createdAt: -1 });

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
