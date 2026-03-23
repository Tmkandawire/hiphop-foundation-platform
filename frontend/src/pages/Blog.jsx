import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Container from "../components/Container";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/posts");
        const data = res.data?.posts || res.data?.data || res.data;
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error:", err);
        setError("Unable to sync stories.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Loader />;

  return (
    <Container className="py-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#145CF3] mb-3">
            HHF Blog
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-[#190E0E] tracking-tight leading-none">
            Our <span className="text-[#145CF3]">Stories.</span>
          </h1>
        </div>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed md:text-right">
          Impact updates, community news, and cultural transformation from the
          Hip Hop Foundation.
        </p>
      </div>

      {error ? (
        <div className="p-8 bg-red-50 text-red-500 rounded-3xl font-medium text-center border border-red-100">
          {error}
        </div>
      ) : !posts.length ? (
        <EmptyState message="The archive is currently empty." />
      ) : (
        <div className="space-y-6">
          {/* FEATURED POST */}
          <Link to={`/blog/${posts[0]._id}`} className="group block">
            <div className="grid md:grid-cols-2 gap-0 bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:border-[#145CF3]/20 hover:shadow-[0_20px_60px_rgba(20,92,243,0.06)] transition-all duration-500">
              <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-[#EBF2FC]">
                {posts[0].image?.url ? (
                  <img
                    src={posts[0].image.url}
                    alt={posts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                    No image
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-[#190E0E] px-3 py-1.5 rounded-xl">
                  Featured
                </span>
              </div>
              <div className="flex flex-col justify-center p-10 space-y-5">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#145CF3]">
                  {new Date(posts[0].createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <h2 className="text-3xl font-black text-[#190E0E] leading-tight group-hover:text-[#145CF3] transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {posts[0].content}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-[#145CF3] px-5 py-3 rounded-xl group-hover:bg-[#0f4fd4] transition-colors">
                    Read Story →
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* REMAINING POSTS */}
          {posts.slice(1).map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post._id}`}
              className="group block"
            >
              <div className="grid md:grid-cols-[280px_1fr] gap-0 bg-white border border-gray-100 rounded-[1.75rem] overflow-hidden hover:border-[#145CF3]/20 hover:shadow-[0_10px_40px_rgba(20,92,243,0.06)] transition-all duration-300">
                <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-[#EBF2FC]">
                  {post.image?.url ? (
                    <img
                      src={post.image.url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      No image
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-[#190E0E] px-3 py-1.5 rounded-xl">
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-col justify-center px-8 py-7 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#145CF3]">
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <h2 className="text-xl font-black text-[#190E0E] leading-snug group-hover:text-[#145CF3] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {post.content}
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-[#145CF3] px-4 py-2.5 rounded-lg group-hover:bg-[#0f4fd4] transition-colors">
                      Read more →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
