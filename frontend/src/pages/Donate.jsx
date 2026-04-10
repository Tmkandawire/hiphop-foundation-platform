import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, Home, BookOpen } from "lucide-react";

/* -------------------------
    ANIMATION VARIANTS
------------------------- */
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // Quintic ease-out
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/* -------------------------
    STATIC DATA
------------------------- */
const vulnerableStats = [
  { number: "6.5M", label: "People living below the poverty line" },
  { number: "51%", label: "Of children face food insecurity daily" },
  { number: "1 in 3", label: "Elderly have no family support system" },
  { number: "70%", label: "Of rural youth lack access to education" },
];

const impactAreas = [
  {
    icon: <Heart size={20} />,
    title: "The Elderly & Sick",
    description:
      "Thousands of elderly and chronically ill Malawians survive without consistent food, medication, or basic care. Many go days without a meal. Your donation puts food on their table and dignity back in their lives.",
  },
  {
    icon: <Users size={20} />,
    title: "Marginalized Families",
    description:
      "Entire families live in conditions that most cannot imagine—no clean water, no income, no safety net. HHF provides direct financial support and basic necessities to those who have nowhere else to turn.",
  },
  {
    icon: <Home size={20} />,
    title: "Displaced Communities",
    description:
      "Natural disasters and economic collapse have left communities across Malawi without shelter or stability. We show up with supplies, support, and a promise that they are not forgotten.",
  },
  {
    icon: <BookOpen size={20} />,
    title: "Youth Without Opportunity",
    description:
      "Young people with talent and drive are held back by poverty. Through creative programs rooted in hip hop culture, we give youth a platform, a voice, and a pathway forward.",
  },
];

const bankDetails = {
  bankName: "National Bank of Malawi",
  bankLogo: null,
  accountName: "Hip Hop Foundation Malawi",
  accountNumber: "XXXX XXXX XXXX",
  branchCode: "XXX-XXX",
  swiftCode: "XXXXXXXX",
  branch: "Blantyre Main Branch",
  currency: "MWK / USD",
};

export default function Donate() {
  return (
    <div className="bg-white text-[#190E0E]">
      {/* ── HERO ── */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="bg-[#EBF2FC] px-6 py-24 md:py-32"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-0.5 bg-[#145CF3]" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3]">
                  Support the Foundation
                </p>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-6xl md:text-8xl font-black text-[#190E0E] tracking-tight leading-none"
              >
                Make a <span className="text-[#145CF3]">Difference.</span>
              </motion.h1>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-2 pt-2"
              >
                {[
                  "Food Relief",
                  "Youth Programs",
                  "Elder Care",
                  "Community",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-black uppercase tracking-widest bg-white text-[#145CF3] border border-[#145CF3]/10 px-4 py-2 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              className="space-y-4 md:text-right max-w-sm"
            >
              <p className="text-sm text-gray-500 leading-relaxed">
                Every contribution, no matter the size, directly changes the
                life of a vulnerable person in Malawi.
              </p>
              <div className="inline-flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Donations Open
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

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

      {/* ── THE REALITY SECTION ── */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeInUp}
              className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3] mb-3"
            >
              The Reality on the Ground
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-black text-[#190E0E] tracking-tight leading-tight"
            >
              Malawi is a nation of resilience but resilience alone is not
              enough.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-black mt-6 text-base leading-relaxed"
            >
              Known as the Warm Heart of Africa, Malawi is home to some of the
              most generous, creative, and determined people on earth. But
              beneath that warmth lies a reality that demands urgent attention.
              Poverty, food insecurity, and systemic neglect leave millions
              behind—the elderly, the sick, displaced families, and young people
              whose potential the world will never see if nothing changes.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-black mt-4 text-base leading-relaxed"
            >
              The Hip Hop Foundation exists because we refused to look away.
              Every outreach. Every meal. Every program. It starts with people
              like you choosing to act.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {vulnerableStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-[#EBF2FC] rounded-[1.75rem] p-8 space-y-3"
              >
                <p className="text-3xl md:text-4xl font-black text-[#145CF3]">
                  {stat.number}
                </p>
                <p className="text-xs font-bold text-gray-500 leading-relaxed">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {impactAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="border border-gray-100 rounded-[2rem] p-8 space-y-4 hover:border-[#145CF3]/20 hover:shadow-[0_10px_40px_rgba(20,92,243,0.06)] transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#EBF2FC] flex items-center justify-center text-[#145CF3]">
                  {area.icon}
                </div>
                <h3 className="font-black text-xl text-[#190E0E]">
                  {area.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW YOUR DONATION HELPS ── */}
      <div className="bg-[#145CF3] px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/75 mb-3">
              Your Impact
            </p>
            <h2 className="text-4xl font-black text-white tracking-tight">
              What your donation does
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                impact: "Feeds a family of four",
                icon: "🍽️",
              },
              {
                impact: "Provides medication and basic care for the elderly",
                icon: "💊",
              },
              {
                impact:
                  "Sponsors youth's participation in our creative development program",
                icon: "🎤",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 border border-white/20 rounded-[2rem] p-8 space-y-4 text-center hover:bg-white/15 transition-colors"
              >
                <span className="text-4xl block">{item.icon}</span>
                <p className="text-2xl font-black text-white">{item.amount}</p>
                <p className="text-sm text-white leading-relaxed">
                  {item.impact}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BANK DETAILS ── */}
      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3] mb-3">
              Send Your Donation
            </p>
            <h2 className="text-4xl font-black text-[#190E0E] tracking-tight">
              Bank Transfer Details
            </h2>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-xl mx-auto">
              Transfer directly to our registered foundation account. Please
              include your name as the reference so we can acknowledge your
              generosity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm"
          >
            {/* Bank header */}
            <div className="bg-[#EBF2FC] px-10 py-8 flex items-center gap-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                {bankDetails.bankLogo ? (
                  <img
                    src={bankDetails.bankLogo}
                    alt={bankDetails.bankName}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#145CF3] flex items-center justify-center">
                    <span className="text-white font-black text-xs">NBM</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-black text-xl text-[#190E0E]">
                  {bankDetails.bankName}
                </p>
                <p className="text-sm text-gray-400 font-medium mt-0.5">
                  {bankDetails.branch}
                </p>
              </div>
            </div>

            {/* Bank details rows */}
            <div className="divide-y divide-gray-50">
              {[
                { label: "Account Name", value: bankDetails.accountName },
                { label: "Account Number", value: bankDetails.accountNumber },
                { label: "Branch Code", value: bankDetails.branchCode },
                { label: "SWIFT / BIC Code", value: bankDetails.swiftCode },
                { label: "Accepted Currency", value: bankDetails.currency },
              ].map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-10 py-5"
                >
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                    {row.label}
                  </p>
                  <p className="font-black text-[#190E0E] text-right">
                    {row.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#EBF2FC] px-10 py-5 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#145CF3] mt-1.5 flex-shrink-0 animate-pulse" />
              <p className="text-xs font-bold text-[#145CF3] leading-relaxed">
                Please use your full name as the payment reference so we can
                personally acknowledge your donation.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── THANK YOU ── */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-[#EBF2FC] rounded-[3rem] py-20 px-10 text-center relative overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="max-w-3xl mx-auto relative z-10 space-y-8"
            >
              <div className="w-16 h-16 bg-[#145CF3] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#145CF3]/20">
                <Heart size={28} className="text-white" fill="white" />
              </div>

              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#145CF3]">
                From All of Us at HHF
              </p>

              <h2 className="text-4xl md:text-5xl font-black text-[#190E0E] leading-tight tracking-tight">
                Thank you for choosing
                <br />
                to make a difference.
              </h2>

              <p className="text-black text-base leading-relaxed max-w-2xl mx-auto">
                We know you have choices about where your generosity goes, and
                the fact that you chose the Hip Hop Foundation means everything
                to us and to the communities we serve. Your donation is not just
                money. It is a meal that reaches a grandmother who has not eaten
                in two days. It is a young person who discovers their voice for
                the first time. It is proof that someone, somewhere, cares.
              </p>

              <p className="text-black text-base leading-relaxed max-w-2xl mx-auto">
                We promise to honour your trust by using every contribution with
                integrity, transparency, and love for the people of Malawi. You
                are now part of this family.
              </p>

              <p className="text-xl font-black text-[#145CF3]">
                — The Hip Hop Foundation Malawi Team
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 bg-[#145CF3] text-white font-black px-10 py-4 rounded-2xl hover:bg-[#0f4fd4] transition-all shadow-lg shadow-[#145CF3]/20"
                >
                  Learn About Our Work
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#190E0E] font-black px-10 py-4 rounded-2xl hover:bg-gray-50 transition-all border border-gray-200"
                >
                  Get in Touch
                </Link>
              </div>
            </motion.div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-[#145CF3]/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#145CF3]/5 rounded-full blur-2xl -ml-10 -mb-10" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
