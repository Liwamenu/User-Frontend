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

const addPaymentMethodSlice = createSlice({
  name: "addPaymentMethod",
  initialState,
  reducers: {
    resetAddPaymentMethod: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(addPaymentMethod.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const addPaymentMethod = createAsyncThunk(
  "Restaurants/AddPaymentMethod",
  async ({ restaurantId, paymentMethodName }, { rejectWithValue }) => {
    try {
      const res = await api.post(`${baseURL}Restaurants/AddPaymentMethod`, {
        restaurantId,
        paymentMethodName,
        sambaId: null,
      });
      return res.data;
    } catch (err) {
      if (err?.response?.data) return rejectWithValue(err.response.data);
      return rejectWithValue({ message_TR: err.message });
    }
  },
);

export const { resetAddPaymentMethod } = addPaymentMethodSlice.actions;
export default addPaymentMethodSlice.reducer;
