// features/brand/brandSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import type { Brand } from "@/types";
// Define your Brand type

interface BrandState {
  items: Brand[];
  status: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BrandState = {
  items: [],
  status: "idle",
  createStatus: "idle",
  error: null,
};

// Create async thunk for creating a brand
export const createBrand = createAsyncThunk(
  "brands/createBrand",
  async (brandData: Omit<Brand, "id">, { rejectWithValue }) => {
    try {
      const response = await api.post("/brands", brandData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create brand"
      );
    }
  }
);

// Create async thunk for fetching brands
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/brands");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch brands"
      );
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (brandId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/brands/${brandId}`);
      return brandId; // Return the brand ID for deletion
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete brand"
      );
    }
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Brand
      .addCase(createBrand.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload as string;
      })

      // Fetch Brands
      .addCase(fetchBrands.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
    // Delete Brand
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (brand) => brand.id !== action.payload
        );
      });
    
  },
});

export default brandSlice.reducer;
