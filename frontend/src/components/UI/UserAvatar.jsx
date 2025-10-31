import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { userLogout } from "../../authenticationSlicer";

const UserAvatar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state) => state.authentication
  );
  console.log("UserAvatar - user:", user);
  const handleLogout = () => {
    dispatch(userLogout());
    setShowDropdown(false);
    toast.success("Logout successful!");
  };

  return (
    <div className="dropdown dropdown-end">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #475569'
          },
        }}
      />
      <div
        tabIndex={0}
        role="button"
        className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors duration-200"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {(user?.firstName?.[0].toUpperCase() ?? "") +
            (user?.lastName?.[0].toUpperCase() ?? "")}
        </div>
        <span className="font-medium">{user?.firstName}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {showDropdown && isAuthenticated && (
        <ul className="mt-2 p-2 shadow-2xl menu dropdown-content bg-slate-800/90 backdrop-blur-sm rounded-box w-52 border border-slate-700/50 z-50">
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </li>
        </ul>
      )}

    </div>
  );
};

export default UserAvatar;
