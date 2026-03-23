import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { postService } from "../../services/postService";
import toast from "react-hot-toast";
import ImageUpload from "../../components/ImageUpload";
import Button from "../../components/Button";
import Container from "../../components/Container";

export default function PostCRUD() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [activePost, setActivePost] = useState(null);

  // Separate form instances for create and edit
  const { register, handleSubmit, reset } = useForm();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm();

  const fetchPosts = async () => {
    setFetching(true);
    try {
      const data = await postService.getAll();
      setPosts(
        Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [],
      );
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Archive sync failed");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const confirmDelete = (post) => {
    setActivePost(post);
    document.getElementById("delete_modal").showModal();
  };

  const handleDelete = async () => {
    if (!activePost) return;
    const loadToast = toast.loading("Removing from archive...");
    try {
      await postService.delete(activePost._id);
      toast.success("Entry deleted", { id: loadToast });
      document.getElementById("delete_modal").close();
      fetchPosts();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed", { id: loadToast });
    }
  };

  const openEdit = (post) => {
    setActivePost(post);
    setValueEdit("edit_title", post.title);
    setValueEdit("edit_content", post.content);
    setEditImageFile(null);
    document.getElementById("edit_modal").showModal();
  };

  const onUpdate = async (data) => {
    setLoading(true);
    const loadToast = toast.loading("Syncing changes...");
    try {
      const formData = new FormData();
      formData.append("title", data.edit_title);
      formData.append("content", data.edit_content);
      if (editImageFile) formData.append("image", editImageFile);

      await postService.update(activePost._id, formData);
      toast.success("Article updated", { id: loadToast });
      document.getElementById("edit_modal").close();
      setEditImageFile(null);
      fetchPosts();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed", { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  const onCreate = async (data) => {
    if (!imageFile) return toast.error("Media asset required");
    setLoading(true);
    const loadToast = toast.loading("Deploying article...");
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("image", imageFile);
      await postService.create(formData);
      toast.success("Live on feed!", { id: loadToast });
      reset();
      setImageFile(null);
      fetchPosts();
    } catch (err) {
      console.error("Creation error:", err);
      toast.error("Publish failed. Check console.", { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="space-y-12 max-w-7xl mx-auto pb-32 px-4">
      {/* HEADER */}
      <div className="bg-white p-12 rounded-[3.5rem] border border-gray-50 shadow-sm">
        <h1 className="text-5xl font-black text-[#190E0E] tracking-tighter">
          Editorial <span className="text-[#145CF3]">Engine</span>
        </h1>
        <p className="text-gray-400 mt-3 font-medium text-lg italic">
          Drafting the future of the foundation.
        </p>
      </div>

      {/* CREATION FORM */}
      <section className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl shadow-blue-500/5">
        <form
          onSubmit={handleSubmit(onCreate)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16"
        >
          <div className="lg:col-span-4 space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4">
              Cover Media
            </label>
            <div className="bg-gray-50 rounded-[3rem] p-10 border-2 border-dashed border-gray-100 aspect-square flex items-center justify-center group hover:border-[#145CF3] transition-colors">
              <ImageUpload onImageUpload={setImageFile} />
            </div>
          </div>
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4">
                Headline
              </label>
              <input
                {...register("title", { required: true })}
                className="w-full bg-gray-50 border-none rounded-2xl p-6 text-2xl font-bold focus:ring-4 ring-blue-500/5"
                placeholder="Article Title..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4">
                Body Content
              </label>
              <textarea
                {...register("content", { required: true })}
                className="w-full bg-gray-50 border-none rounded-[2.5rem] p-8 h-80 text-lg leading-relaxed focus:ring-4 ring-blue-500/5 resize-none"
                placeholder="The narrative starts here..."
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                loading={loading}
                className="px-16 py-6 rounded-2xl text-xl font-black"
              >
                Publish Article
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* PUBLISHED FEED */}
      <section className="space-y-8">
        <div className="flex items-center gap-6 px-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-gray-300">
            Live Archive
          </h2>
          <div className="h-[1px] flex-1 bg-gray-100"></div>
          <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-3 py-1 rounded-full">
            {posts.length} Stories
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {fetching ? (
            <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.5em] text-gray-200 animate-pulse">
              Retrieving Cloud Data...
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white p-6 rounded-[3rem] border border-gray-50 flex items-center gap-10 hover:shadow-xl transition-all group"
              >
                {post.image?.url ? (
                  <img
                    src={post.image.url}
                    className="w-32 h-32 rounded-[2rem] object-cover shadow-lg shadow-gray-200 flex-shrink-0"
                    alt={post.title}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-[2rem] bg-gray-50 flex-shrink-0 flex items-center justify-center text-gray-200 text-xs font-bold">
                    No image
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-2xl text-gray-900 truncate">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 line-clamp-1 text-lg font-medium mt-2">
                    {post.content}
                  </p>
                </div>
                <div className="flex items-center gap-8 pr-10">
                  <button
                    onClick={() => openEdit(post)}
                    className="text-[11px] font-black text-[#145CF3] uppercase tracking-widest hover:scale-110 transition-transform"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(post)}
                    className="text-[11px] font-black text-red-300 uppercase tracking-widest hover:text-red-500 hover:scale-110 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* EDIT MODAL */}
      <dialog id="edit_modal" className="modal backdrop-blur-sm">
        <div className="modal-box bg-white rounded-[4rem] p-16 max-w-4xl border border-gray-100 shadow-2xl">
          <h3 className="font-black text-4xl text-[#190E0E] mb-10 tracking-tighter">
            Refine Entry
          </h3>
          <form onSubmit={handleSubmitEdit(onUpdate)} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-4">
                Headline
              </label>
              <input
                {...registerEdit("edit_title")}
                className="w-full bg-gray-50 border-none rounded-2xl p-6 text-xl font-bold"
              />
            </div>
            <div className="space-y-4 text-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 block mb-4">
                Update Media (Optional)
              </label>
              <div className="max-w-[200px] mx-auto opacity-60 hover:opacity-100 transition-opacity">
                <ImageUpload onImageUpload={setEditImageFile} />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-4">
                Content
              </label>
              <textarea
                {...registerEdit("edit_content")}
                className="w-full bg-gray-50 border-none rounded-[2rem] p-8 h-64 text-lg"
              />
            </div>
            <div className="modal-action gap-4">
              <button
                type="button"
                onClick={() => document.getElementById("edit_modal").close()}
                className="btn btn-ghost rounded-2xl font-bold"
              >
                Discard
              </button>
              <Button
                type="submit"
                loading={loading}
                className="rounded-2xl px-12"
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
            Permanent Removal
          </h3>
          <p className="text-gray-400 font-medium mb-10">
            This will erase{" "}
            <span className="text-gray-900 font-bold">
              "{activePost?.title}"
            </span>{" "}
            from the global archive. This action is irreversible.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-red-200"
            >
              Yes, Confirm Erase
            </button>
            <button
              onClick={() => document.getElementById("delete_modal").close()}
              className="bg-gray-50 text-gray-400 py-5 rounded-2xl font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </Container>
  );
}
