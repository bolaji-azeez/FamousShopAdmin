import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "react-icons/fi";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { path: "/", icon: FiHome, label: "Dashboard" },
    { path: "/admin/products", icon: FiBox, label: "Products" },
    { path: "/admin/orders", icon: FiShoppingCart, label: "Orders" },
    { path: "/admin/brands", icon: FiTag, label: "Brands" },
    { path: "/admin/landing", icon: FiStar, label: "Landing page" },
    { path: "/admin/customers", icon: FiUser, label: "Customers" },
    { path: "/admin/settings", icon: FiSettings, label: "Settings" },
  ];

  // Close sidebar if clicked outside (on mobile)
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
            <FiMenu className="text-xs text-gray-900 dark:text-white" />
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
    </div>
  );
};

export default Sidebar;
