import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Heart, Users, Mic2, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const statsData = [
  { number: "100", suffix: "+", label: "Youth Empowered" },
  { number: "10", suffix: "+", label: "Outreach Programs" },
  { number: "10", suffix: "+", label: "Community Partners" },
  { number: "1", suffix: "+", label: "Years of Impact" },
];

const galleryPlaceholders = [
  { id: 1, aspect: "aspect-square" },
  { id: 2, aspect: "aspect-[4/3]" },
  { id: 3, aspect: "aspect-square" },
  { id: 4, aspect: "aspect-[4/3]" },
  { id: 5, aspect: "aspect-square" },
  { id: 6, aspect: "aspect-[4/3]" },
];

const values = [
  {
    icon: <Heart size={20} />,
    title: "Community First",
    description: "Every decision we make starts with the people we serve.",
  },
  {
    icon: <Mic2 size={20} />,
    title: "Culture as Currency",
    description: "Hip hop is our language, our bridge, and our power.",
  },
  {
    icon: <Users size={20} />,
    title: "No One Left Behind",
    description: "We reach the elderly, the voiceless, and the forgotten.",
  },
  {
    icon: <Star size={20} />,
    title: "Lasting Impact",
    description: "We build programs that outlast funding cycles.",
  },
];

const Counter = ({ number, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const numericValue = parseInt(number, 10);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });

  useEffect(() => {
    if (isInView) motionValue.set(numericValue);
  }, [isInView, motionValue, numericValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest) + suffix;
      }
    });
  }, [springValue, suffix]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-black text-[#145CF3]">
      {suffix}
    </span>
  );
};

const PlaceholderImg = ({ className = "" }) => (
  <div className={`bg-[#D6E8FA] flex items-center justify-center ${className}`}>
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#145CF3"
      strokeWidth="1.5"
      opacity="0.3"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  </div>
);

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  const stripHtml = (html) => html?.replace(/<[^>]*>?/gm, "") || "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts");
        const data = res.data?.data || res.data?.posts || [];
        const sorted = Array.isArray(data)
          ? data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3)
          : [];
        setPosts(sorted);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axiosInstance.get("/gallery");
        const data = res.data?.data || [];
        const latestImages = Array.isArray(data)
          ? data
              .filter((item) => item.mediaType === "image")
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 6)
          : [];
        setGalleryItems(latestImages);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setGalleryLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="bg-white text-[#190E0E]">
      {/* ── HERO — CENTERED TEXT, NO IMAGE ── */}
      <section className="bg-[#EBF2FC] px-6 pt-20 pb-0 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-0.5 bg-[#145CF3]" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3]">
                Hip Hop Foundation Malawi
              </p>
              <div className="w-8 h-0.5 bg-[#145CF3]" />
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl font-black text-[#190E0E] tracking-tight leading-[1.0]">
              Built on <span className="text-[#145CF3]">Culture.</span>
              <br />
              Driven by <span className="text-[#145CF3]">Impact.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
              Bridging the gap between creative culture and critical community
              support.{" "}
              <span className="text-[#190E0E] font-black">
                No one gets left behind.
              </span>
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/donate"
                className="inline-flex items-center gap-2 bg-[#145CF3] hover:bg-[#0f4fd4] text-white font-black px-10 py-4 rounded-2xl transition-all shadow-lg shadow-[#145CF3]/20 hover:-translate-y-0.5"
              >
                Donate Now
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#190E0E] font-black px-10 py-4 rounded-2xl transition-all border border-gray-200"
              >
                Our Story
              </Link>
            </div>
          </motion.div>

          {/* ── DYNAMIC STATS INSIDE HERO ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 border-t border-[#145CF3]/10 pt-10 pb-0"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[#145CF3]/10">
              {statsData.map((stat, i) => (
                <div key={i} className="text-center px-6 pb-10">
                  <Counter number={stat.number} suffix={stat.suffix} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wave divider */}
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

      {/* ── ABOUT PREVIEW ── */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#145CF3] rounded-[2.5rem] p-10 lg:p-14 text-white space-y-6 relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                  Who We Are
                </p>
                <h2 className="text-3xl font-black leading-snug">
                  A foundation built for the people others forget.
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Established in 2025, the Hip Hop Foundation Malawi is a
                  non-profit passionately dedicated to empowering and uplifting
                  vulnerable, marginalized, and economically disadvantaged
                  communities through the transformative power of music and
                  culture.
                </p>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-white text-[#145CF3] font-black text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-all"
                >
                  Read Our Full Story
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-gray-100 rounded-[1.75rem] p-7 space-y-3 hover:border-[#145CF3]/20 hover:shadow-[0_8px_30px_rgba(20,92,243,0.06)] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EBF2FC] flex items-center justify-center text-[#145CF3]">
                    {value.icon}
                  </div>
                  <h3 className="font-black text-[#190E0E]">{value.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      <section className="bg-[#EBF2FC] px-6 py-20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3] mb-2">
                Visual Archive
              </p>
              <h2 className="text-4xl font-black text-[#190E0E] tracking-tight">
                Captured Moments
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-sm font-black text-[#145CF3] hover:gap-3 transition-all"
            >
              View Full Gallery <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryLoading &&
              galleryPlaceholders.map((item) => (
                <div
                  key={item.id}
                  className={`${item.aspect} rounded-[1.5rem] bg-[#D6E8FA] animate-pulse`}
                />
              ))}
            {!galleryLoading &&
              galleryItems.length > 0 &&
              galleryItems.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`${i % 2 === 0 ? "aspect-square" : "aspect-[4/3]"} rounded-[1.5rem] overflow-hidden group cursor-pointer`}
                >
                  <Link to="/gallery">
                    <img
                      src={item.url}
                      alt={item.title || "Gallery item"}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </motion.div>
              ))}
            {!galleryLoading &&
              galleryItems.length === 0 &&
              galleryPlaceholders.map((item) => (
                <div
                  key={item.id}
                  className={`${item.aspect} rounded-[1.5rem] overflow-hidden`}
                >
                  <PlaceholderImg className="w-full h-full" />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── LATEST BLOG POSTS ── */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3] mb-2">
                HHF Blog
              </p>
              <h2 className="text-4xl font-black text-[#190E0E] tracking-tight">
                Latest Stories
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-black text-[#145CF3] hover:gap-3 transition-all"
            >
              View All Stories <ArrowRight size={16} />
            </Link>
          </div>
          {postsLoading && (
            <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.5em] text-gray-200 animate-pulse">
              Loading stories...
            </div>
          )}
          {!postsLoading && posts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-xs font-black uppercase tracking-[0.5em] text-gray-200">
                No stories published yet
              </p>
            </div>
          )}
          {!postsLoading && posts.length > 0 && (
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link to={`/blog/${posts[0]._id}`} className="group block">
                  <div className="grid md:grid-cols-2 gap-0 bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:border-[#145CF3]/20 hover:shadow-[0_20px_60px_rgba(20,92,243,0.06)] transition-all duration-500">
                    <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-[#EBF2FC]">
                      {posts[0].image?.url ? (
                        <img
                          src={posts[0].image.url}
                          alt={posts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <PlaceholderImg className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-10 space-y-5">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#EBF2FC] text-[#145CF3] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                          Latest
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                          {new Date(posts[0].createdAt).toLocaleDateString(
                            undefined,
                            { month: "long", day: "numeric", year: "numeric" },
                          )}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-[#190E0E] leading-tight group-hover:text-[#145CF3] transition-colors line-clamp-2">
                        {posts[0].title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {stripHtml(posts[0].content)}
                      </p>
                      <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-[#145CF3] px-5 py-3 rounded-xl w-fit group-hover:bg-[#0f4fd4] transition-colors">
                        Read Story <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
              {posts.length > 1 && (
                <div className="grid md:grid-cols-2 gap-5">
                  {posts.slice(1).map((post, i) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to={`/blog/${post._id}`}
                        className="group block h-full"
                      >
                        <div className="grid grid-cols-[140px_1fr] gap-0 bg-white border border-gray-100 rounded-[1.75rem] overflow-hidden hover:border-[#145CF3]/20 hover:shadow-[0_10px_40px_rgba(20,92,243,0.06)] transition-all duration-300 h-full">
                          <div className="overflow-hidden bg-[#EBF2FC]">
                            {post.image?.url ? (
                              <img
                                src={post.image.url}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <PlaceholderImg className="w-full h-full" />
                            )}
                          </div>
                          <div className="flex flex-col justify-center px-6 py-5 space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                              {new Date(post.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                            <h3 className="text-sm font-black text-[#190E0E] leading-snug group-hover:text-[#145CF3] transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#145CF3]">
                              Read more <ArrowRight size={10} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#145CF3] rounded-[3rem] py-20 px-10 text-center relative overflow-hidden shadow-2xl shadow-[#145CF3]/20"
          >
            <div className="max-w-3xl mx-auto relative z-10 space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                Make a Difference Today
              </p>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                Every Contribution
                <br />
                Changes a Life.
              </h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto">
                Your donation directly funds outreach programs, food support,
                and creative workshops for the most vulnerable communities in
                Malawi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/donate"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#145CF3] font-black px-12 py-5 rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/10"
                >
                  Donate Now <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-black px-12 py-5 rounded-2xl hover:bg-white/10 transition-all border-2 border-white/20"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
