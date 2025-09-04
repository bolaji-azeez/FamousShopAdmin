// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { login } from "../../service/authService";
import apiClient from "@/lib/axios";

interface DashboardData {
  totalUser: number;
  totalProducts: number;
  totalOrders: number;
  monthlySalesData: unknown[]; 
  salesOverview: unknown[];  
}

interface AuthState {
  user: string | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  error: string | null;
  dashboardData: DashboardData | null;
}


export interface RootState {
  adminAuth: AuthState;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  loading: false,
  error: null,
  dashboardData: {
    totalUser: 0,
    totalProducts: 0,
    totalOrders: 0,
    monthlySalesData: [],
    salesOverview: [],
  },
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginSuccess {
  token: string;
  user: string; // adjust if your API returns more
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message?: string;
  token?: string; 
}

const getAxiosMessage = (err: unknown, fallback = "Request failed") => {
  const ax = err as AxiosError<{ message?: string }>;
  return ax?.response?.data?.message ?? ax?.message ?? fallback;
};


export const loginAdmin = createAsyncThunk<
  LoginSuccess,
  LoginCredentials,
  { rejectValue: string }
>("admin/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await login(credentials); 
    return data as LoginSuccess;
  } catch (err: unknown) {
    return rejectWithValue(getAxiosMessage(err, "Login failed"));
  }
});

export const changeAdminPassword = createAsyncThunk<
  ChangePasswordResponse,
  ChangePasswordData,
  { state: RootState; rejectValue: string }
>("auth/changePassword", async (passwordData, { getState, rejectWithValue }) => {
  try {
    const { adminAuth } = getState(); 
    const { data } = await apiClient.post<ChangePasswordResponse>(
      "/admin/change-password",
      passwordData,
      { headers: { Authorization: `Bearer ${adminAuth.token}` } }
    );
    return data;
  } catch (err: unknown) {
    return rejectWithValue(getAxiosMessage(err, "Password change failed"));
  }
});

export const fetchDashboardOverview = createAsyncThunk<
  DashboardData,
  void,
  { state: RootState; rejectValue: string }
>("auth/fetchDashboardOverview", async (_arg, { getState, rejectWithValue }) => {
  try {
    const { adminAuth } = getState(); 
    const { data } = await apiClient.get<DashboardData>("/admin/overview", {
      headers: { Authorization: `Bearer ${adminAuth.token}` },
    });
    return data;
  } catch (err: unknown) {
    const ax = err as AxiosError<{ message?: string }>;
    if (ax.response) {
      return rejectWithValue(
        ax.response.data?.message ??
          `Server error: ${ax.response.status}`
      );
    }
    if (ax.request) return rejectWithValue("Network error: No response from server");
    return rejectWithValue(`Request setup error: ${ax.message ?? "Unknown error"}`);
  }
});

const authSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      state.dashboardData = {
        totalUser: 0,
        totalProducts: 0,
        totalOrders: 0,
        monthlySalesData: [],
        salesOverview: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<LoginSuccess>) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        if (action.payload.user) state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed";
        state.user = null;
        state.token = null;
        state.dashboardData = initialState.dashboardData;
      })

      .addCase(changeAdminPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        changeAdminPassword.fulfilled,
        (state, action: PayloadAction<ChangePasswordResponse>) => {
          state.status = "succeeded";
          state.error = null;
          if (action.payload.token) {
            state.token = action.payload.token;
          }
        }
      )
      .addCase(changeAdminPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Password change failed";
      })

      .addCase(fetchDashboardOverview.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchDashboardOverview.fulfilled,
        (state, action: PayloadAction<DashboardData>) => {
          state.status = "succeeded";
          state.dashboardData = action.payload ?? initialState.dashboardData;
          state.error = null;
        }
      )
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch dashboard";
        state.dashboardData = initialState.dashboardData;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
