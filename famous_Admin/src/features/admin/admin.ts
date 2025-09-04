
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchDashboardOverview } from "./adminAuthSlice";

export const useDashboardData = () => {
  const dispatch = useAppDispatch();
  const { dashboardData, status, error } = useAppSelector(
    (state) => state.adminAuth
  );

  const getDashboardData = () => {
    dispatch(fetchDashboardOverview());
  };

  return {
    dashboardData,
    isLoading: status === "loading",
    error,
    getDashboardData,
  };
};


