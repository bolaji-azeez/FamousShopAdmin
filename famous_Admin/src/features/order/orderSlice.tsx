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

interface OrdersState {
  items: Order[];
  selectedOrder: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  totalPages: number;
}

const initialState: OrdersState = {
  items: [],
  selectedOrder: null,
  status: "idle",
  error: null,
  page: 1,
  totalPages: 1,
};


export const fetchOrders = createAsyncThunk<
  { orders: Order[]; totalPages: number },
  number, 
  { rejectValue: string }
>("orders/fetchAll", async (page = 1, { rejectWithValue }) => {
  try {
    const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;
    const res = await apiClient.get(`/orders?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { orders: res.data.orders, totalPages: res.data.totalPages };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch orders"
    );
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; newStatus: Order["status"] },
  { rejectValue: string }
>(
  "orders/updateStatus",
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;
      const res = await apiClient.put(
        `/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("orders/fetchById", async (orderId, { rejectWithValue }) => {
  try {
    const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;
    const res = await apiClient.get(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to load order"
    );
  }
});

export const orderDetails = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("orders/fetchDetails", async (orderId, { rejectWithValue }) => {
  try {
    const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;
    const res = await apiClient.get(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to load order details"
    );
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (
          state,
          action: PayloadAction<{ orders: Order[]; totalPages: number }>
        ) => {
          state.status = "succeeded";
          state.items = action.payload.orders;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load orders";
      })

      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const updated = action.payload;
          const index = state.items.findIndex((o) => o.id === updated.id);
          if (index !== -1) state.items[index] = updated;
        }
      )
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update order status";
      })
  
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.selectedOrder = action.payload;
        }
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.error = action.payload || "Failed to load order";
      })
 
      .addCase(
        orderDetails.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.selectedOrder = action.payload;
        }
      )
      .addCase(orderDetails.rejected, (state, action) => {
        state.error = action.payload || "Failed to load order details";
      });

  },
});

export default ordersSlice.reducer;
