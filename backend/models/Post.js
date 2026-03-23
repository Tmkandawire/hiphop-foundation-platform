import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
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
