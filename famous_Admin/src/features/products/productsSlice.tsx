import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";
import type { Product } from "@/types";
import type { AxiosError } from "axios";


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

const getErrorMessage = (e: unknown, fallback = "Request failed") => {
  const err = e as AxiosError<{ message?: string }>;
  return err?.response?.data?.message ?? err?.message ?? fallback;
};
// 🔁 Thunks

type ApiResponse<T> = { data: T; message?: string };

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchAll", async (_arg, { rejectWithValue }) => {
  try {
    const res = await apiClient.get<ApiResponse<Product[]>>("/products");
    return res.data.data; // unwrap
  } catch (e) {
    return rejectWithValue(getErrorMessage(e, "Failed to fetch products"));
  }
});

export const createProduct = createAsyncThunk<
  Product,
  Omit<Product, "productId">,
  { rejectValue: string }
>("products/create", async (productData, { rejectWithValue }) => {
  try {
    const res = await apiClient.post<ApiResponse<Product>>("/products", productData);
    return res.data.data;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e, "Failed to create product"));
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; updates: Partial<Product> },
  { rejectValue: string }
>("products/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const res = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, updates);
    return res.data.data;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e, "Failed to update product"));
  }
});

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("products/delete", async (id, { rejectWithValue }) => {
  try {
    await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e, "Failed to delete product"));
  }
});



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
