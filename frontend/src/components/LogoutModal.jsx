import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutModal({ id }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Call context logout
    // (This already handles toast.dismiss and toast.success internally!)
    logout();

    // 2. Close the modal UI
    const modal = document.getElementById(id);
    if (modal) modal.close();

    // 3. Navigate away immediately
    // Since we put a '!isLoading' guard in App.jsx, this will be smooth.
    navigate("/admin/login", { replace: true });
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box rounded-3xl border border-base-300 shadow-2xl bg-base-100 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 text-warning mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <h3 className="font-bold text-2xl font-poppins text-base-content text-center">
            End Session?
          </h3>
          <p className="py-4 text-base-content/60 font-medium text-center">
            Are you sure you want to exit the HHF Admin Portal?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <form method="dialog" className="flex-1">
            <button className="btn w-full rounded-xl border-2 border-error text-error bg-transparent hover:bg-error hover:text-white transition-all font-bold">
              Cancel
            </button>
          </form>

          <button
            onClick={handleLogout}
            style={{ backgroundColor: "#22c55e", color: "#ffffff" }}
            className="btn flex-1 rounded-xl border-none font-bold shadow-lg shadow-success/20"
          >
            Yes, Log Out
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
