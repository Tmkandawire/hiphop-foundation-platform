import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutModal({ id }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const closeModal = () => {
    const modal = document.getElementById(id);
    if (modal) modal.close();
  };

  const handleLogout = async (logoutAll = false) => {
    setIsLoggingOut(true);
    try {
      // ✅ Now async — waits for backend to revoke refresh token
      await logout(logoutAll);
      closeModal();
      navigate("/admin/login", { replace: true });
    } catch {
      // logout() handles its own errors internally
      // but we still navigate away cleanly
      closeModal();
      navigate("/admin/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white rounded-[3rem] p-10 max-w-md border border-gray-100 shadow-2xl">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#EBF2FC] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#145CF3]"
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

        {/* Text */}
        <div className="text-center mb-8">
          <h3 className="font-black text-2xl text-[#190E0E] font-poppins mb-2">
            Sign Out
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            How would you like to sign out of the HHF Admin Portal?
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Logout this device */}
          <button
            onClick={() => handleLogout(false)}
            disabled={isLoggingOut}
            className="w-full py-4 bg-[#145CF3] hover:bg-[#0f4fd4] text-white font-black rounded-2xl transition-all shadow-lg shadow-[#145CF3]/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm" />
                Signing out...
              </span>
            ) : (
              "Sign out this device"
            )}
          </button>

          {/* Logout all devices */}
          <button
            onClick={() => handleLogout(true)}
            disabled={isLoggingOut}
            className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-500 font-black rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Sign out all devices
          </button>

          {/* Cancel */}
          <button
            onClick={closeModal}
            disabled={isLoggingOut}
            className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 font-bold rounded-2xl transition-all disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Backdrop close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
