import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiClient from "@/lib/axios";

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: "pending" | "confirmed" | "delivered";
  date: string;
}

const initialState: OrdersState = {
  items: [],
  status: "idle",
  error: null,
};

interface OrdersState {
  items: Order[];
  selectedOrder: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  totalPages: number;
}

export const fetchOrders = createAsyncThunk("orders/fetchAll", async () => {
  const res = await apiClient.get("/api/orders");
  return res.data;
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; newStatus: Order["status"] }
>("orders/updateStatus", async ({ orderId, newStatus }) => {
  const res = await apiClient.patch(`/orders/${orderId}/status`, {
    status: newStatus,
  });
  return res.data;
});

export const fetchOrderById = createAsyncThunk<Order, string>(
  "orders/fetchById",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/orders/${orderId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load order"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load orders";
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const updated = action.payload;
          const index = state.items.findIndex((o) => o.id === updated.id);
          if (index !== -1) state.items[index] = updated;
        }
      )
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      });
  },
});

export default ordersSlice.reducer;
