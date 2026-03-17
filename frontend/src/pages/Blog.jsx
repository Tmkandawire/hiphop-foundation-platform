import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

/*
 Blog Page
 Displays list of blog posts with safety checks to prevent .map() errors
*/

export default function Blog() {
  // 1. Always initialize as an empty array []
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts");

        /* 2. SENSITIVE FIX: Axios returns the server response in 'res.data'.
          If your backend sends { posts: [...] }, use res.data.posts.
          If your backend sends [...], use res.data.
          The line below handles both cases safely.
        */
        const data = res.data.posts || res.data;

        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]); // Ensure state remains an array on error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="p-6">Loading blog posts...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      <div className="grid gap-4">
        {/* 3. FINAL SAFETY CHECK: Only map if posts is truly an array */}
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post._id}`}
              className="card bg-base-100 shadow-md p-4 hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold">
                {post.title || "Untitled Post"}
              </h2>

              {/* 4. CONTENT CHECK: Use optional chaining (?.) and a fallback for empty content */}
              <p className="text-gray-600">
                {post.content
                  ? `${post.content.substring(0, 100)}...`
                  : "No description available."}
              </p>
            </Link>
          ))
        ) : (
          <div className="text-gray-500">No blog posts found.</div>
        )}
      </div>
    </div>
  );
}
