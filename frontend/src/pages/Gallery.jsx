import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Filter } from "lucide-react";
import Container from "../components/Container";
import { galleryService } from "../services/galleryService";
import Loader from "../components/Loader";

const CATEGORIES = [
  "All",
  "General",
  "Outreach",
  "Events",
  "Community",
  "Music",
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const images = filteredItems.filter((item) => item.mediaType === "image");
  const videos = items.filter((item) => item.mediaType === "video");
  const featured = items.filter((item) => item.featured).slice(0, 1)[0];

  const navigateImage = useCallback(
    (direction) => {
      setSelectedImageIndex((prev) => {
        if (prev === null) return null;
        const next = prev + direction;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images],
  );

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await galleryService.getAll();
        setItems(data);
        setFilteredItems(data);
      } catch (err) {
        console.error("Gallery Fetch Error:", err);
        setError("Unable to load gallery. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    setFilteredItems(
      activeFilter === "All"
        ? items
        : items.filter((item) => item.category === activeFilter),
    );
  }, [activeFilter, items]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowRight") navigateImage(1);
      if (e.key === "ArrowLeft") navigateImage(-1);
      if (e.key === "Escape") setSelectedImageIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, navigateImage]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#145CF3] text-white rounded-2xl text-sm font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-[#190E0E]">
      {/* ── HERO ── */}
      <div className="bg-[#EBF2FC] px-6 pt-20 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-[#145CF3]" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3]">
                  Visual Archive
                </p>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-[#190E0E] tracking-tight leading-none">
                Our <span className="text-[#145CF3]">Gallery.</span>
              </h1>
              <div className="flex flex-wrap gap-2">
                {["Outreach", "Events", "Community", "Music", "Impact"].map(
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
            </div>
            <div className="space-y-4 md:text-right">
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs md:ml-auto">
                Captured moments of impact, community, and culture from across
                Malawi.
              </p>
              <div className="inline-flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3">
                <div className="w-2 h-2 rounded-full bg-[#145CF3] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  {images.length} Photos · {videos.length} Videos
                </span>
              </div>
            </div>
          </div>

          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                if (featured.mediaType === "image") {
                  const idx = images.findIndex((i) => i._id === featured._id);
                  setSelectedImageIndex(idx >= 0 ? idx : 0);
                } else {
                  setSelectedVideo(featured);
                }
              }}
              className="relative rounded-t-[2.5rem] overflow-hidden aspect-[21/9] cursor-pointer group"
            >
              <img
                src={
                  featured.mediaType === "video"
                    ? featured.thumbnail
                    : featured.url
                }
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#190E0E]/80 via-transparent to-transparent" />
              <div className="absolute top-6 left-6">
                <span className="bg-[#145CF3] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                  Featured
                </span>
              </div>
              {featured.mediaType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play fill="white" size={24} className="ml-1" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#145CF3] mb-2">
                    {featured.category}
                  </p>
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                    {featured.title}
                  </h2>
                </div>
                <div className="hidden md:flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
                  <span>Click to view</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

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

      {/* ── PHOTO SECTION ── */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3] mb-2">
                Captured Moments
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-[#190E0E] tracking-tight">
                Photo Archive
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-gray-300 flex-shrink-0" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                    activeFilter === cat
                      ? "bg-[#145CF3] text-white shadow-lg shadow-[#145CF3]/20"
                      : "bg-[#EBF2FC] text-[#145CF3] hover:bg-[#145CF3] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {images.length === 0 && (
            <div className="py-32 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#EBF2FC] flex items-center justify-center mx-auto">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#145CF3"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.5em] text-gray-200">
                No photos in this category
              </p>
            </div>
          )}

          {images.length > 0 && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {images.map((img, index) => (
                  <motion.div
                    layout
                    key={img._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedImageIndex(index)}
                    className="relative group cursor-pointer overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white break-inside-avoid shadow-sm hover:shadow-xl transition-shadow duration-500"
                  >
                    <img
                      src={img.url}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={img.title}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#190E0E]/80 via-[#190E0E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#145CF3] mb-1">
                        {img.category}
                      </span>
                      <h3 className="font-black text-white text-base leading-tight">
                        {img.title}
                      </h3>
                      {img.description && (
                        <p className="text-white/50 text-xs mt-1 line-clamp-1">
                          {img.description}
                        </p>
                      )}
                    </div>
                    {img.featured && (
                      <span className="absolute top-3 left-3 bg-[#145CF3] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-white/90 text-[#190E0E] text-[10px] font-black px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {index + 1} / {images.length}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── VIDEO SECTION ── */}
      {videos.length > 0 && (
        <div className="bg-[#EBF2FC] px-6 py-20">
          <div className="max-w-7xl mx-auto space-y-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3] mb-2">
                Motion Stories
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-[#190E0E] tracking-tight">
                Video Archive
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((vid, index) => (
                <motion.div
                  key={vid._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedVideo(vid)}
                  className="relative aspect-video rounded-[1.75rem] overflow-hidden group cursor-pointer border border-white/60 shadow-lg bg-white"
                >
                  {vid.thumbnail ? (
                    <img
                      src={vid.thumbnail}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={vid.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#190E0E]" />
                  )}
                  <div className="absolute inset-0 bg-[#190E0E]/40 group-hover:bg-[#145CF3]/30 transition-colors duration-500 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl"
                    >
                      <Play fill="#145CF3" size={22} className="ml-1" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#190E0E]/90 to-transparent">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#145CF3] block mb-1">
                      {vid.category}
                    </span>
                    <h3 className="font-black text-white text-xl tracking-tight">
                      {vid.title}
                    </h3>
                  </div>
                  {vid.featured && (
                    <span className="absolute top-4 left-4 bg-[#145CF3] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE LIGHTBOX ── */}
      <AnimatePresence>
        {selectedImageIndex !== null && images[selectedImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            {/* ── TOP BAR ── */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 bg-black border-b border-white/10">
              {/* Left — image info */}
              <div className="flex items-center gap-4">
                <span className="bg-[#145CF3] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {images[selectedImageIndex].category}
                </span>
                <div>
                  <p className="text-white font-black text-sm leading-tight">
                    {images[selectedImageIndex].title}
                  </p>
                  {images[selectedImageIndex].description && (
                    <p className="text-white/40 text-xs mt-0.5 line-clamp-1 max-w-xs">
                      {images[selectedImageIndex].description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right — counter + close */}
              <div className="flex items-center gap-4">
                <span className="text-white/40 text-xs font-black uppercase tracking-widest hidden sm:block">
                  {selectedImageIndex + 1} of {images.length}
                </span>
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200"
                >
                  <X size={14} strokeWidth={3} />
                  Close
                </button>
              </div>
            </div>

            {/* ── IMAGE + SIDE ARROWS ── */}
            <div className="flex-1 flex items-center justify-center relative px-20 py-6 min-h-0">
              {/* Prev arrow */}
              <button
                onClick={() => navigateImage(-1)}
                className="absolute left-4 md:left-6 flex flex-col items-center gap-2 group z-10"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-[#145CF3] group-hover:border-[#145CF3] transition-all duration-200">
                  <ChevronLeft size={22} />
                </div>
                <span className="text-white/30 group-hover:text-white/60 text-[10px] font-black uppercase tracking-widest transition-colors hidden md:block">
                  Prev
                </span>
              </button>

              {/* Image */}
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].title}
                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
              />

              {/* Next arrow */}
              <button
                onClick={() => navigateImage(1)}
                className="absolute right-4 md:right-6 flex flex-col items-center gap-2 group z-10"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-[#145CF3] group-hover:border-[#145CF3] transition-all duration-200">
                  <ChevronRight size={22} />
                </div>
                <span className="text-white/30 group-hover:text-white/60 text-[10px] font-black uppercase tracking-widest transition-colors hidden md:block">
                  Next
                </span>
              </button>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="flex items-center justify-between px-6 py-3 flex-shrink-0 bg-black border-t border-white/10">
              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === selectedImageIndex
                        ? "w-6 h-2 bg-[#145CF3]"
                        : "w-2 h-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              {/* Keyboard hint */}
              <div className="hidden md:flex items-center gap-3 text-white/20 text-[10px] font-bold uppercase tracking-widest">
                <span className="bg-white/10 px-2 py-1 rounded-md">←</span>
                <span className="bg-white/10 px-2 py-1 rounded-md">→</span>
                <span>to navigate</span>
                <span className="mx-1">·</span>
                <span className="bg-white/10 px-2 py-1 rounded-md">Esc</span>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VIDEO MODAL ── */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#190E0E]/97 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="w-full max-w-5xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#145CF3]">
                    {selectedVideo.category}
                  </p>
                  <h3 className="text-white font-black text-xl mt-0.5">
                    {selectedVideo.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200"
                >
                  <X size={14} strokeWidth={3} />
                  Close
                </button>
              </div>
              <div className="aspect-video rounded-[1.75rem] overflow-hidden bg-black shadow-2xl">
                <video
                  src={selectedVideo.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              </div>
              {selectedVideo.description && (
                <p className="text-white/40 text-sm text-center">
                  {selectedVideo.description}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
