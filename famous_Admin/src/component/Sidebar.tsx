import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiTag,
  FiStar,
  FiUser,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { path: "/admin/dashboard/", icon: FiHome, label: "Dashboard" },
    { path: "products", icon: FiBox, label: "Products" },
    { path: "orders", icon: FiShoppingCart, label: "Orders" },
    { path: "brands", icon: FiTag, label: "Brands" },
    { path: "landing", icon: FiStar, label: "Landing page" },
    { path: "customers", icon: FiUser, label: "Customers" },
    { path: "settings", icon: FiSettings, label: "Settings" },
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    const toastId = "logout-confirmation";
    toast(
      <div>
        <div className="mb-2">Are you sure you want to logout?</div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={() => {
              localStorage.removeItem("token");
              // localStorage.removeItem("user");
              navigate("/");
              toast.dismiss(toastId);
            }}>
            Yes, Logout
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-300 text-gray-800"
            onClick={() => toast.dismiss(toastId)}>
            Cancel
          </button>
        </div>
      </div>,
      {
        id: toastId,
        position: "top-right",
        duration: 0, // Keep the toast open until dismissed
      }
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed md:static top-0 left-0 h-[100vh] transition-all duration-300 z-50
      ${isOpen ? "w-64" : "w-16"} 
      bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4`}>
      {/* Header / Toggle */}
      <div className="flex items-center justify-between mb-8">
        {isOpen ? (
          <h1 className="text-lg font-bold text-gray-900 dark:text-white transition-opacity duration-300">
            Admin Dashboard
          </h1>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <FiMenu className="text-xl text-gray-900 dark:text-white" />
          </button>
        )}
        {/* Close button for mobile */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <FiX className="text-xl text-gray-900 dark:text-white" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group
            ${
              pathname === link.path
                ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}>
            <link.icon className="text-xl transition-transform duration-200 group-hover:scale-110" />
            {isOpen && (
              <span className="ml-3 transition-opacity duration-300">
                {link.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group
        mt-auto mb-4 text-red-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}>
        <FiLogOut className="text-xl transition-transform duration-200 group-hover:scale-110" />
        {isOpen && (
          <span className="ml-3 transition-opacity duration-300">Logout</span>
        )}
      </button>
    </div>
  );
};

export default Sidebar;
