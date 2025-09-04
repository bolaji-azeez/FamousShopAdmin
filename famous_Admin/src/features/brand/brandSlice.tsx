// features/brand/brandSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import type { Brand } from "@/types";
// Define your Brand type

interface BrandState {
  items: Brand[];
  error: string | null;
}

const initialState: BrandState = {
  items: [],
  error: null,
};



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
    
    
    // Delete Brand
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (brand) => brand._id !== action.payload
        );
      });
    
  },
});

export default brandSlice.reducer;
