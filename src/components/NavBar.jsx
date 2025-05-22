// NavBar.jsx
import logo from "../assets/LMCDC.png";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/Authcontext";
import { RiLogoutBoxFill } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { useState } from "react";

export default function NavBar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  const role = localStorage.getItem("role");

  const navItems = {
    admin: [
      {
        path: "/dashboard-admin",
        label: "Dashboard",
        icon: <MdDashboard className="text-lg" />,
      },
      {
        path: "/manageuser-admin",
        label: "Manage Users",
        icon: <HiDocumentReport className="text-lg" />,
      },
      {
        path: "/monitor-visitor-logs",
        label: "Monitor Visitor Logs",
        icon: <FaClipboardList className="text-lg" />,
      },
      // {
      //   path: "/generate-report",
      //   label: "Generate Report",
      //   icon: <HiDocumentReport className="text-lg" />,
      // },
      // {
      //   path: "/scan-visitor",
      //   label: "Scan Visitor",
      //   icon: <FaClipboardList className="text-lg" />,
      // },
    ],
    receptionist: [
      {
        path: "/receptionist-user",
        label: "Manage Visitors",
        icon: <HiDocumentReport className="text-lg" />,
      },
      {
        path: "/scan-visitor",
        label: "Scan Visitor",
        icon: <FaClipboardList className="text-lg" />,
      },
    ],
  };

  const routeTitles = {
    "/dashboard-admin": "Dashboard",
    "/monitor-visitor-logs": "Monitor Visitor Logs",
    // "/generate-report": "Generate Report",
    "/manageuser-admin": "Manage Users",
    "/receptionist-user": "Manage Visitors",
  };

  const title = routeTitles[location.pathname] || "Dashboard";

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1b5e20] text-white flex flex-col items-center py-6 fixed h-screen z-50">
        <img src={logo} alt="LMCDC" className="h-16 mb-2" />
        <h1 className="text-2xl font-semibold mb-10">VPMS</h1>

        <nav className="w-full px-4 space-y-2 text-sm">
          {(navItems[role] || []).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#388e3c]"
            >
              {item.icon} {item.label}
            </Link>
          ))}
          {/* Logout button moved to header */}
        </nav>
      </aside>
      {/* Top Navbar */}
      <div className="flex-1">
        <header className="fixed top-0 left-64 right-0 h-16 bg-[#a5d6a7] flex items-center justify-center z-40 shadow-sm">
          <div className="w-full max-w-7xl flex px-5.5 items-center justify-between">
            <h2 className="text-xl font-bold text-[#2e2e2e]">{title}</h2>
            <div className="flex items-center gap-4 text-[#2e2e2e]">
              <button
                className="flex items-center gap-2 focus:outline-none transition hover:bg-[#e0f2f1] rounded px-2 py-1 cursor-pointer"
                onClick={() => setShowConfirm(true)}
                style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
                aria-label="User menu"
              >
                <FiUser className="text-xl" />
                <span className="font-medium capitalize">{role || "User"}</span>
              </button>
            </div>
            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center">
                  <p className="mb-4 text-lg text-gray-800 text-center">
                    Are you sure you want to logout?
                  </p>
                  <div className="flex gap-4">
                    <button
                      className="px-4 py-2 rounded bg-[#1b5e20] text-white hover:bg-[#388e3c]"
                      onClick={() => {
                        setShowConfirm(false);
                        logout();
                      }}
                    >
                      Yes, Logout
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}
