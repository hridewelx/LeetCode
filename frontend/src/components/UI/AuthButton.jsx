import { NavLink, useLocation } from "react-router-dom";

const AuthButton = () => {
  const location = useLocation();
  
  // Store current location before redirecting to auth pages
  const getAuthLink = (path) => {
    return `${path}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
  };

  return (
    <div className="flex items-center gap-2">
      <NavLink
        to={getAuthLink("/login")}
        className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-md transition-all duration-200 font-medium text-sm border border-purple-500/30 shadow-lg hover:shadow-purple-500/20 flex items-center gap-1.5 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
        Login
      </NavLink>

      <NavLink
        to={getAuthLink("/signup")}
        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-md transition-all duration-200 font-medium text-sm border border-blue-500/30 shadow-lg hover:shadow-blue-500/20 flex items-center gap-1.5 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Sign Up
      </NavLink>
    </div>
  );
};

export default AuthButton;