import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";


import api from "@/lib/axios"; 

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  isActive: boolean;
  avatar?: string;
}

interface UsersState {
  users: User[];
  currentUser: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: UsersState = {
  users: [],
  currentUser: null,
  status: "idle",
  error: null,
};

// Async Thunks

export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "users/fetchCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/me");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateUser = createAsyncThunk<
  User,
  { id: string; updates: Partial<User> }
>("users/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/admin/users/${id}`, updates);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch users";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      });
  },
});

export const { clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
