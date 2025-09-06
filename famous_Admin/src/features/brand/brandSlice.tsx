
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import type { Brand } from "@/types";


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
      return brandId; 
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
    
    
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (brand) => brand._id !== action.payload
        );
      });
    
  },
});

export default brandSlice.reducer;
