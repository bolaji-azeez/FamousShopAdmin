// src/features/auth/authApi.ts
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { changeAdminPassword, fetchDashboardOverview } from "./adminAuthSlice";

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

export const useChangePassword = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.adminAuth);

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    const result = await dispatch(
      changeAdminPassword({ currentPassword, newPassword })
    );
    return result;
  };

  return {
    changePassword,
    isLoading: status === "loading",
    error,
  };
};
