import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    content: { type: String, required: true },

    image: { type: String },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
