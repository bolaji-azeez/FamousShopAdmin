import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductState {
  items: Product[];
  selectedProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  status: "idle",
  error: null,
};
// 🔁 Thunks

export const fetchProduct = createAsyncThunk<Product, string>(
  "products/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/products/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const createProduct = createAsyncThunk<Product, Omit<Product, "id">>(
  "products/create",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/products", productData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; updates: Partial<Product> }
>("products/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const res = await apiClient.put(`/product${id}`, updates);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update product"
    );
  }
});

// 🔧 Slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.status = "succeeded";
          state.selectedProduct = action.payload;
        }
      )
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.items.push(action.payload);
        }
      )
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.items.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) state.items[index] = action.payload;
        }
      );
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
