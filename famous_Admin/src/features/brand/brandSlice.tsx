import { createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit';
import apiClient from '@/lib/axios'; // adjust path if needed
import { type Brand } from '@/types';

interface BrandsState {
  items: Brand[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BrandsState = {
  items: [],
  status: 'idle',
  error: null,
};

// 🔁 Thunk to fetch brands
export const fetchBrands = createAsyncThunk<Brand[]>(
  'brands/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/brands');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch brands');
    }
  }
);

// 🧱 Slice
const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action: PayloadAction<Brand[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default brandsSlice.reducer;
