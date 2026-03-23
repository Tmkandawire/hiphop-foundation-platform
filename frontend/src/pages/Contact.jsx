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

  return (
    <Container className="py-24">
      {/* Widened to 7xl to give the form more breathing room */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
        {/* LEFT: CONTENT AREA (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-10 pt-10">
          <div className="space-y-6">
            <span className="bg-blue-50 text-[#145CF3] px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.4em] inline-block">
              Contact Portal
            </span>
            <h1 className="text-7xl md:text-8xl font-black text-[#190E0E] tracking-tighter leading-[0.9]">
              Let’s <br />
              <span className="text-[#145CF3]">Connect.</span>
            </h1>
          </div>

          <p className="text-2xl text-gray-400 font-medium leading-relaxed max-w-sm">
            Have a question about the Hip Hop Foundation? Reach out and our team
            will get back to you shortly.
          </p>

          <div className="pt-10 space-y-6">
            <div className="flex items-center gap-6 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#145CF3] group-hover:text-white transition-all shadow-sm">
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

        {/* RIGHT: WIDER HIGH-TECH FORM (Spans 3 columns) */}
        <div className="lg:col-span-3 bg-white p-12 md:p-16 rounded-[4.5rem] border border-gray-100 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl -mr-40 -mt-40 opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-30"></div>

          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-300 ml-3">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full bg-gray-50 border-none rounded-3xl p-6 text-gray-900 font-bold focus:ring-4 ring-blue-500/10 transition-all placeholder:text-gray-300"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-300 ml-3">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full bg-gray-50 border-none rounded-3xl p-6 text-gray-900 font-bold focus:ring-4 ring-blue-500/10 transition-all placeholder:text-gray-300"
                  placeholder="john@foundation.org"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-300 ml-3">
                Subject Inquiry
              </label>
              <input
                type="text"
                name="subject"
                className="w-full bg-gray-50 border-none rounded-3xl p-6 text-gray-900 font-bold focus:ring-4 ring-blue-500/10 transition-all placeholder:text-gray-300"
                placeholder="How can we help you today?"
                value={form.subject}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-300 ml-3">
                Message Transmission
              </label>
              <textarea
                name="message"
                className="w-full bg-gray-50 border-none rounded-[3.5rem] p-10 h-64 text-gray-900 font-medium leading-relaxed focus:ring-4 ring-blue-500/10 transition-all resize-none placeholder:text-gray-300"
                placeholder="Share your thoughts or inquiries..."
                value={form.message}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-8 rounded-[2.5rem] bg-[#145CF3] text-white font-black text-xl shadow-2xl shadow-blue-500/30 transition-all active:scale-[0.98] ${
                isSubmitting
                  ? "opacity-70"
                  : "hover:bg-[#114ed1] hover:-translate-y-1"
              }`}
            >
              {isSubmitting ? "Syncing channels..." : "Send Transmission"}
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}
