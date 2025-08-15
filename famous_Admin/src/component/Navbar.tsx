"use client";

import React, { useState, useRef, useEffect } from "react";
import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../theme-context";
import { useGetNotificationsQuery } from "@/features/notification/notficationApi";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const adminName = localStorage.getItem("admin_name") || "Admin"; // Replace with dynamic admin name

  const [hasNotification, setHasNotification] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { data: notifications = [], isLoading, error } = useGetNotificationsQuery();

  useEffect(() => {
  // Example: Set hasNotification if there are any notifications
  setHasNotification(notifications.length > 0);
}, [notifications]);

  // Close the notification panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);


  useEffect(() => {
  // Example: Set hasNotification if there are any notifications
  setHasNotification(notifications.length > 0);
}, [notifications]);

  return (
    <header className="bg-white dark:bg-gray-900 shadow p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 transition-colors relative">
      {/* Logo / Title */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Famous Store Dashboard
      </h2>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Admin Welcome */}
        <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
          Welcome, {adminName}
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-300">
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notification Button */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-300 relative"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setHasNotification(false);
            }}>
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            {hasNotification && (
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </Button>

          {/* Notifications Dropdown */}
        {showNotifications && (
  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-50 animate-slide-down">
    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200">
      Notifications
    </div>
    <ul className="max-h-64 overflow-auto">
      {isLoading ? (
        <li className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Loading...
        </li>
                 ) : error ? (
        <li className="px-4 py-4 text-center text-sm text-red-500 dark:text-red-400">
          Error loading notifications
        </li>
      ) : notifications.length > 0 ? (
        notifications.map((note) => (
          <li
            key={note.id}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            {note.message}
          </li>
        ))
      ) : (
        <li className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No new notifications
        </li>
      )}
    </ul>
  </div>
)}
        </div>
      </div>
    </header>
  );
}
