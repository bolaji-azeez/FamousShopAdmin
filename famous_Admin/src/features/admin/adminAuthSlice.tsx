// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../../service/authService";
import apiClient from "@/lib/axios";


interface DashboardData {
  totalUser: number;
  totalProducts: number;
  totalOrders: number;
  monthlySalesData: any[]; 
  salesOverview: any[]; 
}

interface AuthState {
  user: string | null; 
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  dashboardData: DashboardData | null; 
}
const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  dashboardData: {
    // This is the default empty state
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

export interface ChangePasswordData {
 currentPassword: string;
  newPassword: string;
}

export const loginAdmin = createAsyncThunk(
  "admin/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await login(credentials);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const changeAdminPassword = createAsyncThunk(
  "auth/changePassword",
  async (
    passwordData: {currentPassword: string, newPassword: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const { adminAuth } = getState() as { adminAuth: AuthState }; // Type assertion for getState
      const response = await apiClient.post(
        "/admin/change-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${adminAuth.token}`,
          },
        }
      );
      console.log("Password change successful:", response.data);
      return response.data;
    } catch (error) {
       console.log("Raw error:", error); // Add this line
      return rejectWithValue(
        error.response?.data?.message || "Password change failed"
      );
    }
  }
);

export const fetchDashboardOverview = createAsyncThunk(
  "auth/fetchDashboardOverview",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const response = await apiClient.get("/admin/overview", {
        headers: {
          // If state.auth.token is something like "\"abc...xyz\"", this will be invalid.
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data as DashboardData;
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        return rejectWithValue("Network error: No response from server");
      } else {
        return rejectWithValue(`Request setup error: ${error.message}`);
      }
    }
  }
);

const authSlice = createSlice({
  name: "adminAuth", // Name of the slice
  initialState,
  reducers: {
    logout: (state) => {
      // REMOVED: localStorage.removeItem("authToken"); // Rely on redux-persist
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      // Reset dashboardData to the initial empty state on logout
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
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token; // Redux-persist will save this token
        state.error = null;
      })
     .addCase(loginAdmin.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
      state.user = null;
      state.token = null;
      state.dashboardData = initialState.dashboardData;
    })
      .addCase(changeAdminPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
     .addCase(changeAdminPassword.fulfilled, (state, action) => {
  state.status = "succeeded";
  state.error = null;
  // If backend returns a new token:
  if (action.payload.token) {
    state.token = action.payload.token;
  }
})
      .addCase(changeAdminPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.dashboardData = action.payload;
        } else {
          state.dashboardData = initialState.dashboardData;
        }
        state.error = null;
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.dashboardData = initialState.dashboardData; // Reset to zeros on fetch failure
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;


