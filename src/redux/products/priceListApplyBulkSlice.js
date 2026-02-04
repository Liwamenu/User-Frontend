import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const priceListApplyBulkSlice = createSlice({
  name: "priceListApplyBulk",
  initialState: initialState,
  reducers: {
    resetPriceListApplyBulk: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(priceListApplyBulk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(priceListApplyBulk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(priceListApplyBulk.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const priceListApplyBulk = createAsyncThunk(
  "Products/PriceListApplyBulk",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`${baseURL}Products/PriceListApplyBulk`, data);

      console.log(res);
      return res.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message_TR: err.message });
    }
  },
);

export const { resetPriceListApplyBulk } = priceListApplyBulkSlice.actions;
export default priceListApplyBulkSlice.reducer;
