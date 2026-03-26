import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Container from "../components/Container";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { motion } from "framer-motion"; // Make sure to npm install framer-motion

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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (loading) return <Loader />;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* HERO HEADER */}
      <div className="bg-[#EBF2FC] px-6 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-[#145CF3]" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3]">
                  HHF Blog
                </p>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-[#190E0E] tracking-tight leading-none">
                Our <span className="text-[#145CF3]">Stories.</span>
              </h1>

              <div className="flex flex-wrap gap-2 pt-2">
                {["Impact", "Community", "Culture", "Music", "Youth"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-black uppercase tracking-widest bg-white text-[#145CF3] border border-[#145CF3]/10 px-4 py-2 rounded-full"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="space-y-6 md:text-right max-w-xs"
            >
              <p className="text-sm text-gray-500 leading-relaxed">
                Impact updates, community news, and cultural transformation from
                the Hip Hop Foundation.
              </p>
              <div className="inline-flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#145CF3] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  {posts.length} {posts.length === 1 ? "Story" : "Stories"}{" "}
                  Published
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* DIVIDER WAVE */}
      <div className="bg-[#EBF2FC]">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path d="M0 0 C360 40 1080 40 1440 0 L1440 40 L0 40 Z" fill="white" />
        </svg>
      </div>

      {/* POSTS LISTING */}
      <Container className="py-16">
        {error ? (
          <div className="p-8 bg-red-50 text-red-500 rounded-3xl font-medium text-center border border-red-100">
            {error}
          </div>
        ) : !posts.length ? (
          <EmptyState message="The archive is currently empty." />
        ) : (
          <div className="space-y-12">
            {/* FEATURED POST */}
            <motion.div variants={itemVariants}>
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
                      {new Date(posts[0].createdAt).toLocaleDateString(
                        undefined,
                        { month: "long", day: "numeric", year: "numeric" },
                      )}
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
            </motion.div>

            {/* REMAINING POSTS GRID/LIST */}
            <div className="grid grid-cols-1 gap-6">
              {posts.slice(1).map((post, index) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  // We add a slightly increasing delay for the grid items
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post._id}`} className="group block">
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
                          {new Date(post.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center px-8 py-7 space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#145CF3]">
                          {new Date(post.createdAt).toLocaleDateString(
                            undefined,
                            { month: "long", day: "numeric", year: "numeric" },
                          )}
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
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </motion.div>
  );
}
