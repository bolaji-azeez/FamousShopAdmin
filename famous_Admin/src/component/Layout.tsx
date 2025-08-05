"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ThemeProvider } from "@/theme-context";
import { FiMenu } from "react-icons/fi";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Sidebar (Desktop + Mobile Drawer) */}
        <div
          className={`fixed z-50 top-0 left-0 h-full transition-transform duration-300 md:relative md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:block`}
        >
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-h-screen">
          {/* Navbar */}
          <Navbar>
            {/* Hamburger Menu Button (Mobile Only) */}
            <button
              className="md:hidden p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </Navbar>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <Outlet />
          </main>
        </div>
      </div>

      {/* Backdrop for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </ThemeProvider>
  );
}
