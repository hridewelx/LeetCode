import { NavLink } from "react-router-dom";
import { useState } from "react";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: "/admin/questions",
      label: "Questions",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      label: "Add Question",
      path: "/admin/questions/create",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      label: "View Questions",
      path: "/admin/questions",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: "Update Questions",
      path: "/admin/questions/update",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      label: "Delete Questions",
      path: "/admin/questions/delete",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )
    },
    {
      label: "View Reports",
      path: "/admin/analytics",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-6m4 6V7m4 10V9M3 3v18h18"
          />
        </svg>
      ),
    },
    {
      label: "System Health",
      path: "/admin/settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`bg-gradient-to-b from-slate-800 to-slate-900 text-slate-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } relative`}
    >
      {/* Header with Toggle */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-400 mt-1">Management Console</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="border p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-slate-400 hover:text-white"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d={
                  collapsed
                    ? "M13 5l7 7-7 7M5 5l7 7-7 7"
                    : "M11 19l-7-7 7-7m8 14l-7-7 7-7"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"} 
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600/20 text-white border-r-5 border-blue-500 shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              } ${collapsed ? "justify-center px-3" : ""}`
            }
            title={item.label ?? ""}
          >
            <div
              className={`transition-colors duration-200 ${
                collapsed ? "" : "mr-3"
              }`}
            >
              {item.icon}
            </div>
            {!collapsed && (
              <span className="transition-opacity duration-200">
                {item.label}
              </span>
            )}
            {!collapsed && (
              <svg
                className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Actions Section */}
      {!collapsed && (
        <div className="mt-8 px-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <NavLink
                key={index}
                to={action.path}
                className="flex items-center px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md transition-all duration-200 group"
              >
                <span className="mr-2 text-sm">{action.icon}</span>
                <span className="flex-1 text-left">{action.label}</span>
                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      {!collapsed && (
        <div className="mt-8 px-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            System Status
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">API</span>
              <span className="text-green-400 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Database</span>
              <span className="text-green-400 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                Stable
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Users Online</span>
              <span className="text-blue-400">24</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 ${
          collapsed ? "text-center" : ""
        }`}
      >
        {!collapsed ? (
          <div className="text-xs text-slate-500">
            <p>Admin Console v1.0</p>
            <p className="mt-1">© 2024 Your Company</p>
          </div>
        ) : (
          <div className="text-xs text-slate-500">v1.0</div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
