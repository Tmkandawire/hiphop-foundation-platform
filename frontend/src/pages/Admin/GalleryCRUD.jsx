import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { galleryService } from "../../services/galleryService";
import toast from "react-hot-toast";
import Button from "../../components/Button";

const CATEGORIES = ["General", "Outreach", "Events", "Community", "Music"];

export default function GalleryCRUD() {
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [editMediaFile, setEditMediaFile] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [preview, setPreview] = useState(null);

  const { register, handleSubmit, reset } = useForm();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm();

  const fetchItems = async () => {
    setFetching(true);
    try {
      const data = await galleryService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gallery fetch error:", err);
      toast.error("Failed to load gallery");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleMediaChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isEdit) {
      setEditMediaFile(file);
    } else {
      setMediaFile(file);
    }
  };

  const onCreate = async (data) => {
    if (!mediaFile) return toast.error("Please select an image or video");
    setLoading(true);
    const loadToast = toast.loading("Uploading to gallery...");
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("category", data.category);
      formData.append("featured", data.featured ? "true" : "false");
      formData.append("media", mediaFile);
      await galleryService.create(formData);
      toast.success("Added to gallery!", { id: loadToast });
      reset();
      setMediaFile(null);
      fetchItems();
    } catch (err) {
      console.error("Gallery create error:", err);
      toast.error("Upload failed", { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (item) => {
    setActiveItem(item);
    setValueEdit("edit_title", item.title);
    setValueEdit("edit_description", item.description);
    setValueEdit("edit_category", item.category);
    setValueEdit("edit_featured", item.featured);
    setEditMediaFile(null);
    document.getElementById("edit_modal").showModal();
  };

  const onUpdate = async (data) => {
    setLoading(true);
    const loadToast = toast.loading("Updating...");
    try {
      const formData = new FormData();
      formData.append("title", data.edit_title);
      formData.append("description", data.edit_description || "");
      formData.append("category", data.edit_category);
      formData.append("featured", data.edit_featured ? "true" : "false");
      if (editMediaFile) formData.append("media", editMediaFile);
      await galleryService.update(activeItem._id, formData);
      toast.success("Updated!", { id: loadToast });
      document.getElementById("edit_modal").close();
      setEditMediaFile(null);
      fetchItems();
    } catch (err) {
      console.error("Gallery update error:", err);
      toast.error("Update failed", { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (item) => {
    setDeletingItem(item);
    document.getElementById("delete_modal").showModal();
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    const loadToast = toast.loading("Removing...");
    try {
      await galleryService.delete(deletingItem._id);
      toast.success("Removed from gallery", { id: loadToast });
      document.getElementById("delete_modal").close();
      setDeletingItem(null);
      fetchItems();
    } catch (err) {
      console.error("Gallery delete error:", err);
      toast.error("Delete failed", { id: loadToast });
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      await galleryService.toggleFeatured(item._id);
      toast.success(
        item.featured ? "Removed from featured" : "Marked as featured",
      );
      fetchItems();
    } catch (err) {
      console.error("Toggle featured error:", err);
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* HEADER */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <h1 className="text-4xl font-black text-[#190E0E] tracking-tighter">
          Gallery <span className="text-[#145CF3]">Studio</span>
        </h1>
        <p className="text-[#190E0E]/40 mt-1 font-medium italic">
          Managing visual assets for the foundation.
        </p>
      </div>

      {/* UPLOAD FORM */}
      <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <h2 className="text-lg font-black text-[#190E0E] mb-8 tracking-tight">
          Upload New Asset
        </h2>
        <form onSubmit={handleSubmit(onCreate)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Title
              </label>
              <input
                {...register("title", { required: true })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-medium text-sm focus:outline-none focus:border-[#145CF3] transition-all"
                placeholder="e.g. Community Outreach 2025"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-medium text-sm focus:outline-none focus:border-[#145CF3] transition-all"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Description (optional)
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-medium text-sm focus:outline-none focus:border-[#145CF3] transition-all resize-none h-24"
              placeholder="Brief description of this media..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Media File (Image or Video)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleMediaChange(e, false)}
                  className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-2xl px-5 py-4 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#EBF2FC] file:text-[#145CF3] file:font-bold file:text-xs hover:border-[#145CF3] transition-all cursor-pointer"
                />
              </div>
              {mediaFile && (
                <p className="text-xs text-[#145CF3] font-bold ml-1">
                  ✓ {mediaFile.name}
                </p>
              )}
            </div>

            {/* Featured toggle + Submit */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="w-5 h-5 rounded accent-[#145CF3]"
                />
                <span className="text-sm font-bold text-gray-500">
                  Mark as Featured
                </span>
              </label>
              <Button
                type="submit"
                loading={loading}
                className="px-8 py-4 rounded-2xl font-black flex-shrink-0"
              >
                Upload
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* GALLERY GRID */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-gray-300">
            Gallery Assets
          </h2>
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-3 py-1 rounded-full">
            {items.length} Items
          </span>
        </div>

        {fetching ? (
          <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.5em] text-gray-200 animate-pulse">
            Loading gallery...
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.5em] text-gray-200">
            No assets uploaded yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all group"
              >
                {/* Media Preview */}
                <div
                  className="relative aspect-video bg-gray-50 cursor-pointer"
                  onClick={() => setPreview(item)}
                >
                  {item.mediaType === "video" ? (
                    <div className="w-full h-full flex items-center justify-center bg-[#190E0E]">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-70"
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Featured badge */}
                  {item.featured && (
                    <span className="absolute top-3 left-3 bg-[#145CF3] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}

                  {/* Category badge */}
                  <span className="absolute top-3 right-3 bg-white/90 text-[#190E0E] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-black text-[#190E0E] truncate">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-[11px] font-black text-[#145CF3] uppercase tracking-widest hover:scale-110 transition-transform"
                      >
                        Edit
                      </button>
                      <span className="text-gray-200">·</span>
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`text-[11px] font-black uppercase tracking-widest hover:scale-110 transition-transform ${
                          item.featured
                            ? "text-amber-400"
                            : "text-gray-300 hover:text-amber-400"
                        }`}
                      >
                        {item.featured ? "★ Featured" : "☆ Feature"}
                      </button>
                    </div>
                    <button
                      onClick={() => confirmDelete(item)}
                      className="text-red-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PREVIEW MODAL */}
      {preview && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-12 right-0 text-white/60 hover:text-white font-black text-sm uppercase tracking-widest"
            >
              Close ✕
            </button>
            {preview.mediaType === "video" ? (
              <video
                src={preview.url}
                controls
                autoPlay
                className="w-full rounded-[2rem] shadow-2xl"
              />
            ) : (
              <img
                src={preview.url}
                alt={preview.title}
                className="w-full rounded-[2rem] shadow-2xl object-contain max-h-[80vh]"
              />
            )}
            <div className="mt-4 text-center">
              <p className="text-white font-black text-lg">{preview.title}</p>
              {preview.description && (
                <p className="text-white/50 text-sm mt-1">
                  {preview.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      <dialog id="edit_modal" className="modal backdrop-blur-sm">
        <div className="modal-box bg-white rounded-[3rem] p-12 max-w-2xl border border-gray-100 shadow-2xl">
          <h3 className="font-black text-3xl text-[#190E0E] mb-8 tracking-tighter">
            Edit Asset
          </h3>
          <form onSubmit={handleSubmitEdit(onUpdate)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Title
                </label>
                <input
                  {...registerEdit("edit_title")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-medium text-sm focus:outline-none focus:border-[#145CF3] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Category
                </label>
                <select
                  {...registerEdit("edit_category")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-medium text-sm focus:outline-none focus:border-[#145CF3] transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Description
              </label>
              <textarea
                {...registerEdit("edit_description")}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-medium text-sm focus:outline-none focus:border-[#145CF3] transition-all resize-none h-24"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Replace Media (optional)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleMediaChange(e, true)}
                className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-2xl px-5 py-4 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#EBF2FC] file:text-[#145CF3] file:font-bold file:text-xs hover:border-[#145CF3] transition-all cursor-pointer"
              />
              {editMediaFile && (
                <p className="text-xs text-[#145CF3] font-bold ml-1">
                  ✓ {editMediaFile.name}
                </p>
              )}
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...registerEdit("edit_featured")}
                className="w-5 h-5 rounded accent-[#145CF3]"
              />
              <span className="text-sm font-bold text-gray-500">
                Mark as Featured
              </span>
            </label>
            <div className="modal-action gap-4">
              <button
                type="button"
                onClick={() => document.getElementById("edit_modal").close()}
                className="btn btn-ghost rounded-2xl font-bold"
              >
                Cancel
              </button>
              <Button
                type="submit"
                loading={loading}
                className="rounded-2xl px-10"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </dialog>

      {/* DELETE MODAL */}
      <dialog id="delete_modal" className="modal backdrop-blur-md">
        <div className="modal-box bg-white rounded-[3.5rem] p-12 max-w-md text-center border-4 border-red-50">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-black">!</span>
          </div>
          <h3 className="font-black text-3xl text-gray-900 mb-2">
            Remove Asset
          </h3>
          <p className="text-gray-400 font-medium mb-10">
            This will permanently delete{" "}
            <span className="text-gray-900 font-bold">
              "{deletingItem?.title}"
            </span>{" "}
            from the gallery and Cloudinary. This action is irreversible.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-red-200"
            >
              Yes, Remove It
            </button>
            <button
              onClick={() => {
                document.getElementById("delete_modal").close();
                setDeletingItem(null);
              }}
              className="bg-gray-50 text-gray-400 py-5 rounded-2xl font-bold hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
