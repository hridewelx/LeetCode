import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthenticatedUser, userLogout } from "../../authenticationSlicer";

const AdminHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.authentication);

  const getAuthLink = (path) => {
    return `${path}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); 

  useEffect(() => {
    if (isAuthenticated && (!user?.firstName || !user?.lastName)) {
      dispatch(checkAuthenticatedUser());
    }
  }, [dispatch, isAuthenticated, user]);
  
  const handleLogin = () => {
    navigate(getAuthLink("/login"));
  };

  const handleLogout = () => {
    dispatch(userLogout());
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    if (path.includes("/admin/questions")) return "Question Management";
    if (path.includes("/admin/users")) return "User Management";
    return "Admin Panel";
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <header className="select-none bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg border-b border-slate-700">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section - Page Title & Breadcrumb */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
          <div className="flex items-center space-x-2 text-sm text-slate-300 mt-1">
            <span>Admin</span>
            <span className="text-slate-400 font-bold">›</span>
            <span>{getPageTitle()}</span>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-4">
          {/* Date & Time */}
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-sm font-medium text-white">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-slate-300">
              {formatDate(currentTime)}
            </span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
            >
              <div className="flex flex-col items-end text-right">
                <span className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {(user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")}
              </div>
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-slate-700">
                  <p className="text-sm text-white font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                
                <div className="p-2" onClick={(e) => e.stopPropagation()}>
                  <button className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors duration-200">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Profile Settings</span>
                  </button>

                  <button className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors duration-200">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.3 16.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.7 0 1.26-.44 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.3 6.3A2 2 0 1 1 7.12 3.47l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .7.44 1.26 1 1.51.64.3 1.31.12 1.82-.33l.06-.06A2 2 0 1 1 19.4 7.12l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.7 0 1.26.44 1.51 1 .09.3.08.62 0 .92z" />
                    </svg>
                    <span>Preferences</span>
                  </button>

                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-md transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <path d="M16 17l5-5-5-5" />
                        <path d="M21 12H9" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default AdminHeader;