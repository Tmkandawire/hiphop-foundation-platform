import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Container from "../components/Container";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { motion } from "framer-motion";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/posts/${id}`);
        const data = res.data?.post || res.data?.data || res.data;
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Could not retrieve this entry.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  // Manual formatter to handle **bold text** without react-markdown
  const formatContent = (text) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="text-[#190E0E] font-black">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  if (loading) return <Loader />;
  if (error || !post)
    return (
      <Container>
        <EmptyState message={error || "Entry not found."} />
      </Container>
    );

  return (
    <Container className="py-20">
      <motion.article
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl mx-auto"
      >
        {/* BACK NAVIGATION */}
        <motion.button
          variants={fadeInUp}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-[#145CF3] transition-colors mb-12 group"
        >
          <span className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#145CF3] group-hover:bg-[#EBF2FC] transition-all text-xs">
            ←
          </span>
          Back to Blog Hub
        </motion.button>

        {/* HERO SECTION */}
        <motion.header variants={fadeInUp} className="space-y-8 mb-16">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="bg-[#EBF2FC] text-[#145CF3] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Official Post
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#190E0E] tracking-tight leading-[1.1]">
              {post.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#145CF3] flex items-center justify-center text-white text-[10px] font-black">
              HHF.
            </div>
            <span className="text-sm font-bold text-gray-400">
              By Hip Hop Foundation
            </span>
          </div>
        </motion.header>

        {/* FEATURED IMAGE */}
        {post.image?.url && (
          <motion.div variants={fadeInUp} className="mb-16">
            <img
              src={post.image.url}
              alt={post.title}
              className="w-full h-auto aspect-video object-cover rounded-[3rem] shadow-2xl shadow-blue-500/10 border border-gray-100"
            />
          </motion.div>
        )}

        {/* ARTICLE BODY */}
        <motion.div
          variants={fadeInUp}
          className="text-xl text-gray-600 font-medium leading-[1.8] whitespace-pre-wrap"
        >
          {formatContent(post.content)}
        </motion.div>

        {/* FOOTER */}
        <motion.footer
          variants={fadeInUp}
          className="mt-20 pt-10 border-t border-gray-100"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <Link to="/blog" className="inline-flex items-center gap-3 group">
              <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#145CF3] group-hover:bg-[#EBF2FC] transition-all text-sm">
                ←
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                  Continue Reading
                </p>
                <p className="text-sm font-black text-[#190E0E] group-hover:text-[#145CF3] transition-colors">
                  Back to Blog Hub
                </p>
              </div>
            </Link>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-3 group"
            >
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                  Jump to
                </p>
                <p className="text-sm font-black text-[#190E0E] group-hover:text-[#145CF3] transition-colors">
                  Top of Page
                </p>
              </div>
              <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#145CF3] group-hover:bg-[#EBF2FC] transition-all text-sm">
                ↑
              </span>
            </button>
          </div>
        </motion.footer>
      </motion.article>
    </Container>
  );
}
