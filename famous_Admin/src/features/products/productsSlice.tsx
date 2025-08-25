import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";
import type { Product } from "@/types";

//  interface Product {
//   _id: string;
//   productId: number;
//   name: string;
//   brand: string;
//   description: string;
//   quantity: number;
//   price: number;
//   images: string[];
//   features: string[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

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

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/products");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const createProduct = createAsyncThunk<
  Product,
  Omit<Product, "productId">
>("products/create", async (productData, { rejectWithValue }) => {
  try {
    const res = await apiClient.post("/products", productData);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create product"
    );
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; updates: Partial<Product> }
>("products/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const res = await apiClient.put(`/products/${id}`, updates);

    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update product"
    );
  }
});

export const deleteProduct = createAsyncThunk<string, string>(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/products/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// 🔧 Slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    setSelectedProduct(state, action: PayloadAction<Product>) {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.items = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
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
            (p) => p._id === action.payload._id
          );
          if (index !== -1) state.items[index] = action.payload;
        }
      )

      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter((p) => p._id !== action.payload);
        }
      );
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
