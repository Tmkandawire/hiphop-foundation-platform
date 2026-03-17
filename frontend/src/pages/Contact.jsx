import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

/*
 Contact Page
 Corrected with loading states and user feedback
*/

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Track the request status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    // Clear status message when user starts typing again
    if (statusMsg.text) setStatusMsg({ type: "", text: "" });

    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setStatusMsg({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post("/messages", form);

      setStatusMsg({ type: "success", text: "Message sent successfully!" });

      // Reset form
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      setStatusMsg({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      {/* Status Alert Message */}
      {statusMsg.text && (
        <div
          className={`alert ${statusMsg.type === "success" ? "alert-success" : "alert-error"} mb-4 shadow-lg text-white p-3 rounded`}
        >
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="input input-bordered w-full mb-3"
          value={form.name}
          onChange={handleChange}
          disabled={isSubmitting} // Disable while sending
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="input input-bordered w-full mb-3"
          value={form.email}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />

        <textarea
          name="message"
          placeholder="Your Message"
          className="textarea textarea-bordered w-full mb-3 min-h-[150px]"
          value={form.message}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />

        <button
          type="submit"
          className={`btn btn-primary w-full ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
