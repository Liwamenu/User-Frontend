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

const deletePaymentMethodSlice = createSlice({
  name: "deletePaymentMethod",
  initialState,
  reducers: {
    resetDeletePaymentMethod: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(deletePaymentMethod.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const deletePaymentMethod = createAsyncThunk(
  "Restaurants/DeletePaymentMethod",
  async ({ restaurantId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(
        `${baseURL}Restaurants/DeletePaymentMethod`,
        {
          params: { restaurantId, paymentMethodId },
        },
      );
      return res.data;
    } catch (err) {
      if (err?.response?.data) return rejectWithValue(err.response.data);
      return rejectWithValue({ message_TR: err.message });
    }
  },
);

export const { resetDeletePaymentMethod } = deletePaymentMethodSlice.actions;
export default deletePaymentMethodSlice.reducer;
