"use client";

import {
  useMemo,
  useState,
  useRef,
  useEffect,
  type PropsWithChildren,
} from "react";
import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import  useTheme  from "../theme/UseTheme";
import { useGetNotificationsQuery } from "@/features/notification/notficationApi";

type Notification = {
  _id: string;
  message: string;
};

export default function Navbar({ children }: PropsWithChildren) {
  const { theme, toggleTheme } = useTheme();
  const adminName =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_name") || "Admin"
      : "Admin";

  const [hasNotification, setHasNotification] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useGetNotificationsQuery();

  const notifications = useMemo<Notification[]>(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  useEffect(() => {
    setHasNotification(notifications.length > 0);
  }, [notifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <header className="bg-white dark:bg-gray-900 shadow p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 transition-colors relative">
      <div className="flex items-center gap-2">
        {children}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Famous Store Dashboard
        </h2>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
          Welcome, {adminName}
        </div>

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
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Notifications
              </div>
              <ul className="max-h-64 overflow-auto">
                {isLoading ? (
                  <li className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Loading...
                  </li>
                ) : isError ? (
                  <li className="px-4 py-4 text-center text-sm text-red-500 dark:text-red-400">
                    Error loading notifications
                  </li>
                ) : notifications.length > 0 ? (
                  notifications.map((note: Notification) => (
                    <li
                      key={note._id} // use _id, not id
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
