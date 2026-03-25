import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Container from "../components/Container";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error("All fields are required.");
    }

    setIsSubmitting(true);
    const loadToast = toast.loading("Sending transmission...");

    try {
      await axiosInstance.post("/messages", form);
      toast.success("Message delivered successfully!", { id: loadToast });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Transmission failed.", {
        id: loadToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `
    w-full bg-white border border-gray-200 rounded-2xl px-6 py-5
    text-gray-900 font-medium text-sm
    focus:outline-none focus:border-[#145CF3] focus:ring-4 focus:ring-[#145CF3]/8
    transition-all placeholder:text-gray-300
    hover:border-gray-300
  `;

  return (
    <Container className="py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
        {/* LEFT: CONTENT AREA */}
        <div className="lg:col-span-2 space-y-10 pt-10">
          <div className="space-y-6">
            <span className="bg-blue-50 text-[#145CF3] px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.4em] inline-block">
              Contact Portal
            </span>
            <h1 className="text-7xl md:text-8xl font-black text-[#190E0E] tracking-tighter leading-[0.9]">
              Let's <br />
              <span className="text-[#145CF3]">Connect.</span>
            </h1>
          </div>

          <p className="text-2xl text-gray-400 font-medium leading-relaxed max-w-sm">
            Have a question about the Hip Hop Foundation? Reach out and our team
            will get back to you shortly.
          </p>

          <div className="pt-10 space-y-6">
            <div className="flex items-center gap-6 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#145CF3] transition-all shadow-sm border border-gray-100">
                <span className="font-bold text-lg text-[#145CF3] group-hover:text-white transition-colors">
                  @
                </span>
              </div>
              <p className="font-black text-xl text-gray-900 tracking-tight">
                hello@hiphopfoundation.org
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="lg:col-span-3 bg-white p-12 md:p-16 rounded-[4.5rem] border border-gray-100 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl -mr-40 -mt-40 opacity-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-30 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className={inputClass}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className={inputClass}
                  placeholder="john@foundation.org"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Subject Inquiry
              </label>
              <input
                type="text"
                name="subject"
                className={inputClass}
                placeholder="How can we help you today?"
                value={form.subject}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Message
              </label>
              <textarea
                name="message"
                className={`${inputClass} h-52 resize-none rounded-3xl py-5`}
                placeholder="Share your thoughts or inquiries..."
                value={form.message}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-6 rounded-2xl bg-[#145CF3] text-white font-black text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#114ed1] hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? "Syncing channels..." : "Send Transmission →"}
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}
