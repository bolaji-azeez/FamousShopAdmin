import { createSlice, createAsyncThunk, type PayloadAction,  } from '@reduxjs/toolkit';

// Define types for your admin user data
interface AdminUser {
  id: string;
  email: string;
  name: string;
  // Add other admin user properties as needed
}

interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: AdminUser;
  token: string;
}

// Initial state with type
const initialState: AdminAuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const loginAdmin = createAsyncThunk<LoginResponse, LoginCredentials>(
  'adminAuth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      return await res.json() as LoginResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    logoutAdmin: (state: AdminAuthState) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || action.error.message || 'Login failed';
      });
  },
});

export const { logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;