import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import type { Notification } from "@/types";
import api from "../../api/api";
import { AxiosError } from "axios";


interface NotificationState {
  items: Notification[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  status: "idle",
  error: null,
};

const getErrorMessage = (e: unknown, fallback = "Request failed") => {
  const err = e as AxiosError<{ message?: string }>;
  return err?.response?.data?.message ?? err?.message ?? fallback;
};

type ApiResponse<T> = { data: T; message?: string };

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>("notifications/fetchNotifications", async (_arg, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<Notification[]>>("/notifications");
    return response.data.data;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e, "Failed to fetch notifications"));
  }
});

export const createNotification = createAsyncThunk<
  Notification,
  Omit<Notification, "id">,
  { rejectValue: string }
>("notifications/createNotification", async (notificationData, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse<Notification>>("/notifications", notificationData);
    return response.data.data;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e, "Failed to create notification"));
  }
});

export const deleteNotification = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notifications/deleteNotification", async (notificationId, { rejectWithValue }) => {
  try {
    await api.delete<ApiResponse<null>>(`/notifications/${notificationId}`);
    return notificationId;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e, "Failed to delete notification"));
  }
});


const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createNotification.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteNotification.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (notification) => notification._id !== action.payload
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});


export const notificationReducer = notificationSlice.reducer;