// src/hooks/useDashboardData.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks"; // Adjust path as needed
// IMPORTANT: Make sure this path is correct for your slice file.
// If your slice is in features/admin/adminAuthSlice, use that.
// If it's in features/auth/authSlice, use that.
import { fetchDashboardOverview } from "../features/admin/adminAuthSlice";


export const useDashboardData = () => {
  const dispatch = useAppDispatch();
  // Assuming your Redux store has a slice named 'adminAuth'
  const { dashboardData, status, error } = useAppSelector(
    (state) => state.adminAuth // <-- Ensure this matches your store configuration
  );

  useEffect(() => {
    // Fetch only if the status is idle or failed, to avoid re-fetching if already loaded.
    if (status === "idle" || status === "failed") {
      dispatch(fetchDashboardOverview());
    }
  }, [status, dispatch]); // Depend on status and dispatch

  return {
    dashboardData,
    isLoading: status === "loading",
    isSucceeded: status === "succeeded", // Added for better UI control
    isFailed: status === "failed",      // Added for better UI control
    error,
  };
};