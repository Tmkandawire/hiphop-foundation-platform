import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { messageService } from "../../services/messageService";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeFolder, setActiveFolder] = useState("inbox"); // 'inbox', 'sent', 'trash'
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async (folder) => {
    try {
      setLoading(true);
      const data = await messageService.getAll(folder);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`Sync failed for ${folder}:`, err);
      toast.error(`Failed to sync ${folder}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(activeFolder);
  }, [activeFolder]);

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    setReplyText("");
    document.getElementById("message_view_modal").showModal();
  };

  const handleAction = async (id, actionType) => {
    const actionLabel = actionType === "purge" ? "Purging" : "Moving";
    const loadToast = toast.loading(`${actionLabel} transmission...`);

    try {
      if (actionType === "trash") {
        await messageService.moveToTrash(id);
      } else {
        await messageService.purge(id);
      }

      toast.success(
        `Transmission ${actionType === "trash" ? "trashed" : "purged"}`,
        { id: loadToast },
      );
      setMessages((prev) => prev.filter((m) => m._id !== id));
      document.getElementById("message_view_modal").close();
    } catch (err) {
      console.error(`${actionLabel} failed`, err);
      toast.error("Operation failed", { id: loadToast });
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim())
      return toast.error("Content required for broadcast.");

    setIsSending(true);
    const loadToast = toast.loading("Broadcasting reply...");
    try {
      await messageService.reply(selectedMessage._id, replyText);
      toast.success("Reply Transmitted", { id: loadToast });

      // Move message to 'replied' state or refresh
      setMessages((prev) => prev.filter((m) => m._id !== selectedMessage._id));
      document.getElementById("message_view_modal").close();
    } catch (err) {
      console.error("Broadcast failed", err);
      toast.error("Broadcast failed", { id: loadToast });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-fade-in">
      {/* --- SIDEBAR NAVIGATION --- */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-sm">
          {[
            { id: "inbox", label: "Inbox", icon: "📥" },
            { id: "sent", label: "Sent", icon: "🚀" },
            { id: "trash", label: "Trash", icon: "🗑️" },
          ].map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl font-bold transition-all ${
                activeFolder === folder.id
                  ? "bg-[#145CF3] text-white shadow-lg shadow-blue-200"
                  : "text-gray-400 hover:bg-gray-50 hover:text-[#145CF3]"
              }`}
            >
              <span className="flex items-center gap-4 text-sm">
                <span>{folder.icon}</span> {folder.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --- MAIN MESSAGE LIST --- */}
      <div className="lg:col-span-3 space-y-6">
        <header className="px-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-[#190E0E] tracking-tighter capitalize">
              {activeFolder} <span className="text-[#145CF3]">Hub</span>
            </h1>
            <p className="text-gray-400 font-medium text-sm italic">
              Status: System Online
            </p>
          </div>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 italic">
              Decrypting Streams...
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
              <p className="text-gray-300 font-bold italic">
                No data streams detected in {activeFolder}.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => openMessage(msg)}
                className="group bg-white p-8 rounded-[2.5rem] border border-gray-50 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/5 transition-all"
              >
                <div
                  className={`w-3 h-3 rounded-full ${msg.isReplied ? "bg-emerald-400" : "bg-[#145CF3]"}`}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-xl text-gray-900 truncate">
                      {msg.name}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-300 uppercase">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[#145CF3] font-bold text-sm mb-1">
                    {msg.subject || "No Subject"}
                  </p>
                  <p className="text-gray-400 line-clamp-1 italic">
                    "{msg.message}"
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-[#145CF3]">
                  Open File →
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- COMMUNICATION MODAL --- */}
      <dialog id="message_view_modal" className="modal backdrop-blur-md">
        <div className="modal-box bg-white rounded-[4rem] p-0 max-w-4xl border border-gray-100 shadow-2xl overflow-hidden">
          <div className="bg-[#145CF3] p-10 text-white flex justify-between items-center">
            <div className="space-y-1">
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Secure Transmission
              </span>
              <h2 className="text-4xl font-black tracking-tighter">
                {selectedMessage?.subject}
              </h2>
            </div>
            <button
              onClick={() =>
                document.getElementById("message_view_modal").close()
              }
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold hover:bg-white/20 transition-all"
            >
              ✕
            </button>
          </div>

          <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-xl font-black text-[#145CF3] shadow-sm">
                  {selectedMessage?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-gray-900">
                    {selectedMessage?.name}
                  </p>
                  <p className="text-[#145CF3] font-bold text-xs">
                    {selectedMessage?.email}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-[2.5rem] p-8 text-md leading-relaxed text-gray-500 font-medium italic border border-gray-100 h-64 overflow-y-auto">
                "{selectedMessage?.message}"
              </div>
              <button
                onClick={() =>
                  handleAction(
                    selectedMessage._id,
                    activeFolder === "trash" ? "purge" : "trash",
                  )
                }
                className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300 hover:text-red-500 transition-colors"
              >
                {activeFolder === "trash"
                  ? "⚠️ Permanent Purge"
                  : "Move to Trash"}
              </button>
            </div>

            <div className="space-y-6">
              {activeFolder === "sent" ? (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl">
                    ✓
                  </div>
                  <h4 className="font-black text-xl text-gray-900">
                    Reply Sent
                  </h4>
                  <div className="p-6 bg-emerald-50/50 rounded-3xl text-sm italic text-emerald-700 w-full border border-emerald-100">
                    "{selectedMessage?.replyContent || "No content logged."}"
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleReply}
                  className="h-full flex flex-col space-y-4"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-2">
                    Internal Response
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-gray-900 text-blue-100 rounded-[2.5rem] p-8 text-sm font-medium leading-relaxed resize-none focus:ring-4 ring-blue-500/10 placeholder:text-gray-700"
                    placeholder="Type reply to broadcast..."
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-[#145CF3] text-white py-6 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {isSending ? "Syncing..." : "Transmit Reply"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Inbox;
