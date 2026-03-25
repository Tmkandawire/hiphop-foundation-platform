import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import foundationImg from "../assets/Images/Foundation_Img.jpg";
import outreachImg from "../assets/Images/Outreach_Img.jpg";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

// --- Data Constants ---
const statsData = [
  { number: "100+", label: "Youth Empowered" },
  { number: "10+", label: "Outreach Programs" },
  { number: "10+", label: "Community Partners" },
  { number: "1+", label: "Years of Impact" },
];

const values = [
  {
    title: "Community First",
    description:
      "Everything we do starts and ends with the communities we serve. We listen, collaborate, and grow together.",
  },
  {
    title: "Cultural Pride",
    description:
      "Hip hop is more than music — it is identity and resistance. We celebrate Malawian culture in every beat.",
  },
  {
    title: "Sustainable Impact",
    description:
      "We build programs that outlast funding cycles. Our goal is lasting transformation, not temporary relief.",
  },
  {
    title: "Creative Freedom",
    description:
      "We leverage hip hop culture as a catalyst for radical community support. We serve as a shield for the elderly and young",
  },
];

const founder = {
  name: "Ishmael Kachali",
  role: "Executive Director & Founder",
  bio: "Ishmael Kachali (IKK) is the founder of the HHF, a charity committed to empowering less fortunate communities through the transformative power of music and culture. By putting together a team of passionate and driven individuals, IKK has helped the elderly, sickly, destitute, economically deprived and voiceless communities by providing food, financial support and other basic needs which come sparingly to these families and individuals, if at all. Recognized for this compassionate approach, IKK has also been featured on various social and traditional media outlets for the impact that the HHF outreach work has made on these disadvantaged communities.",
  initials: "IKK",
};

// --- Sub-Component: Animated Counter ---
const Counter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Logic to separate numbers from symbols (e.g., "500" from "+")
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericValue);
    }
  }, [isInView, motionValue, numericValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="overflow-x-hidden bg-white">
      {/* ── HERO ── */}
      <section className="pt-16 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3] flex items-center gap-2">
                <span className="w-6 h-0.5 bg-[#145CF3] inline-block" />
                About Us
              </p>
              <h1 className="text-5xl md:text-6xl font-black text-[#190E0E] tracking-tight leading-[1.05]">
                Our Story, <span className="text-[#145CF3]">Vision</span>,{" "}
                <br /> and Values
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:text-right md:pt-4"
            >
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm md:ml-auto">
                Discover our commitment to youth empowerment and the cultural
                principles guiding our work across Malawi.
              </p>
            </motion.div>
          </div>

          {/* ── HERO IMAGE SECTION ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            /* Changed from aspect-[16/7] to aspect-[4/3] to fit your actual photo */
            className="relative rounded-[3rem] overflow-hidden aspect-[4/3] md:aspect-[16/10] bg-gray-100 group shadow-2xl"
          >
            <div className="w-full h-full">
              <img
                src={foundationImg}
                alt="HHF Community Outreach"
                /* 'object-top' ensures that even on weird screens, we prioritize the faces */
                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                loading="eager"
              />

              {/* Gradient Overlay - slightly lighter to keep the vibrant colors of the photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50" />
            </div>

            {/* Scroll Down Button */}
            <a
              href="#story"
              className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-[#145CF3] flex items-center justify-center text-white hover:bg-[#0f4fd4] transition-all shadow-xl z-10 hover:scale-110 active:scale-95"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── STORY & OUTREACH ── */}
      <section id="story" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <svg
                  width="40"
                  height="30"
                  viewBox="0 0 32 24"
                  fill="#145CF3"
                  className="opacity-20 mb-6"
                >
                  <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C11.2 3.6 8.8 6 8 9.6H14.4V24H0zm17.6 0V14.4C17.6 6.4 22.4 1.6 32 0l1.6 2.4c-4.8 1.2-7.2 3.6-8 7.2H32V24H17.6z" />
                </svg>
                <p className="text-3xl font-bold text-[#190E0E] leading-tight italic">
                  "Basic needs shouldn't come "sparingly." For the destitute and
                  economically deprived families in our community, your donation
                  is the difference between a crisis and a meal. Support our
                  outreach today and help us provide consistent relief to those
                  who need it most."
                </p>
              </motion.div>

              {/* --- Outreach Image with Hover Effect --- */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="rounded-[2.5rem] overflow-hidden aspect-video bg-[#F8FAFE] border border-[#145CF3]/5 shadow-lg group relative"
              >
                <img
                  src={outreachImg}
                  alt="Community Outreach Program"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  loading="lazy" // Better for performance below the fold
                />
                {/* Subtle overlay that fades out on hover */}
                <div className="absolute inset-0 bg-[#145CF3]/5 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            </div>

            {/* --- History Card --- */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#145CF3] rounded-[3rem] p-10 lg:p-14 text-white shadow-2xl shadow-[#145CF3]/20 relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-white/50">
                  Our Story
                </p>
                <p className="text-xl leading-relaxed text-white/90 font-medium">
                  Established in 2025 The Hip Hop Foundation is a non-profit
                  organization passionately dedicated to empowering and
                  uplifting the vulnerable, marginalized and economically
                  disadvantaged communities. The core motivation behind this
                  goal is strengthening the lives of the less fortunate.
                </p>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Est. 2025 · Blantyre
                  </span>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ANIMATED STATS ── */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] px-10 py-12 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsData.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center group"
                >
                  <p className="text-4xl lg:text-5xl font-black text-[#145CF3] mb-2 transition-transform group-hover:scale-105 duration-300">
                    <Counter value={stat.number} />
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3] mb-3">
              What Drives Us
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-[#190E0E] tracking-tight">
              Vision & Mission
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border border-gray-100 rounded-[2.5rem] p-10 lg:p-14 space-y-6 hover:border-[#145CF3]/20 hover:shadow-[0_10px_40px_rgba(20,92,243,0.06)] transition-all duration-500"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#145CF3] animate-pulse" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#190E0E]">
                  Vision
                </p>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-[#190E0E] leading-snug">
                A society where the vulnerable are visible, valued, and
                empowered to thrive.
              </h3>
              <div className="h-px bg-gray-100" />
              <p className="text-sm text-gray-400 leading-relaxed">
                We envision a Malawi where age, illness, or economic status no
                longer define a person's potential. Our goal is a future where
                the less fortunate experience a permanent shift from surviving
                to thriving, supported by a community rooted in unconditional
                love and radical hope.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#145CF3] rounded-[2.5rem] p-10 lg:p-14 space-y-6 shadow-2xl shadow-[#145CF3]/20 relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">
                    Mission
                  </p>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-snug">
                  To transform lives by merging Hip Hop culture with
                  humanitarian action.
                </h3>
                <div className="h-px bg-white/20" />
                <p className="text-sm text-white/70 leading-relaxed">
                  We exist to uplift orphans, the elderly, and the sickly
                  through consistent outreach and sustainable support. By
                  leveraging the core principles of Hip Hop unity, resilience,
                  and peace we deliver essential needs and financial relief to
                  economically disadvantaged families, restoring their dignity
                  and their future.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES (Alternate Colors) ── */}
      <section className="bg-[#F8FAFE] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3] mb-3">
              Our DNA
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-[#190E0E] tracking-tight">
              Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const isEven = (i + 1) % 2 === 0;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-[2.5rem] p-10 space-y-5 transition-all duration-500 shadow-sm
                    ${
                      isEven
                        ? "bg-[#145CF3] text-white hover:shadow-xl hover:shadow-[#145CF3]/30"
                        : "bg-white text-[#190E0E] hover:shadow-xl border border-gray-50"
                    }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black
                    ${isEven ? "bg-white/10 text-white" : "bg-[#EBF2FC] text-[#145CF3]"}`}
                  >
                    0{i + 1}
                  </div>
                  <h3 className="font-black text-xl leading-tight">
                    {value.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${isEven ? "text-white/70" : "text-gray-400"}`}
                  >
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOUNDER (Single Centered) ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3] mb-3">
              Leadership
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-[#190E0E] tracking-tight">
              Meet the Founder
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group border border-gray-100 rounded-[3rem] p-10 md:p-16 space-y-8 hover:border-[#145CF3]/20 transition-all duration-700 hover:shadow-2xl text-center"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-[#EBF2FC] flex items-center justify-center text-[#145CF3] font-black text-3xl mx-auto group-hover:bg-[#145CF3] group-hover:text-white transition-all duration-500">
              {founder.initials}
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-3xl text-[#190E0E]">
                {founder.name}
              </h3>
              <p className="text-sm font-bold text-[#145CF3] uppercase tracking-[0.2em]">
                {founder.role}
              </p>
            </div>
            <div className="h-px bg-gray-100 w-24 mx-auto" />
            <p className="text-gray-500 leading-relaxed text-lg italic max-w-2xl mx-auto">
              "{founder.bio}"
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA (Rounded & Inlined) ── */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#145CF3] rounded-[3.5rem] py-20 px-10 text-center relative overflow-hidden shadow-2xl shadow-[#145CF3]/20"
          >
            <div className="max-w-3xl mx-auto relative z-10 space-y-10">
              <h2 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                Ready to make <br className="hidden md:block" /> a difference?
              </h2>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link
                  to="/donate"
                  className="px-12 py-5 bg-white text-[#145CF3] font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/10"
                >
                  Donate Now →
                </Link>
                <Link
                  to="/contact"
                  className="px-12 py-5 bg-transparent text-white font-black rounded-2xl hover:bg-white/10 transition-all border-2 border-white/20"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
