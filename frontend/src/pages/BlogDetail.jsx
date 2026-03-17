import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

/*
  Blog Detail Page
  Corrected Version: Added safety checks and clear loading/error states.
*/

export default function BlogDetail() {
  const { id } = useParams(); // Get the ID from the URL (/blog/:id)
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/posts/${id}`);

        // Safety check for data nesting (handles res.data or res.data.post or res.data.data)
        const data = res.data.post || res.data.data || res.data;

        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Could not find this blog post.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3">Reading post...</p>
      </div>
    );
  }

  // 2. Error or Not Found State
  if (error || !post) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="mb-6">{error || "Blog post not found."}</p>
        <Link to="/blog" className="btn btn-outline">
          Back to Blog
        </Link>
      </div>
    );
  }

  // 3. Final Render (Guaranteed to have 'post' data here)
  return (
    <article className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to="/blog"
          className="text-primary hover:underline flex items-center gap-2"
        >
          &larr; Back to all posts
        </Link>
      </div>

      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
        {post.createdAt && (
          <p className="text-sm text-gray-500">
            Published on: {new Date(post.createdAt).toLocaleDateString()}
          </p>
        )}
      </header>

      {/* If your blog has images, you can uncomment this:
      {post.image && (
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-auto rounded-xl shadow-lg mb-8" 
        />
      )} 
      */}

      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
        {post.content || "This post has no content."}
      </div>
    </article>
  );
}
