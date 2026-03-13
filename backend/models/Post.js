import mongoose from "mongoose";

// 1- create a schema
// 2- model based off of that schema

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: String,

    author: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Post", postSchema);
