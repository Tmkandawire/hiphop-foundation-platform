import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useForm } from "react-hook-form";

/*
  Admin Post CRUD Page
  --------------------
  Responsibilities:
  - Create new blog posts
  - Fetch and display existing posts
  - Frontend validation for form inputs using React Hook Form
*/

export default function PostCRUD() {
  const [posts, setPosts] = useState([]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  /*
    Run once on component mount
    We wrap async fetchPosts in an inner function because
    useEffect cannot take an async function directly
  */
  useEffect(() => {
    const initialize = async () => {
      await fetchPosts();
    };
    initialize();
  }, []); // empty dependency array ensures it runs only once

  // Handle form submission to create a post
  const onSubmit = async (data) => {
    try {
      await axiosInstance.post("/posts", data);
      await fetchPosts(); // refresh the posts list
      reset(); // clear form after submission
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Posts</h1>

      {/* Create Post Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>

        <div>
          <textarea
            placeholder="Content"
            className="textarea textarea-bordered w-full"
            {...register("content", { required: "Content is required" })}
          />
          {errors.content && (
            <span className="text-red-500 text-sm">
              {errors.content.message}
            </span>
          )}
        </div>

        <button className="btn btn-primary w-full">Create Post</button>
      </form>

      {/* Posts List */}
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="card bg-base-100 shadow p-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{post.content.substring(0, 100)}...</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
