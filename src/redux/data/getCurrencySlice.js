import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const pentURL = import.meta.env.VITE_PENTEGRASYON_API;

const initialState = {
  loading: false,
  success: false,
  error: false,
  currency: null,
};

const getCurrencySlice = createSlice({
  name: "getCurrency",
  initialState: initialState,
  reducers: {
    resetGetCurrency: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.currency = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getCurrency.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.currency = null;
      })
      .addCase(getCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.currency = action.payload;
      })
      .addCase(getCurrency.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.currency = null;
      });
  },
});

export const getCurrency = createAsyncThunk(
  "Currencies/GetCurrencyByCurrencyCode",
  async ({ currencyCode = "USD" }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${pentURL}Currencies/GetCurrencyByCurrencyCode`,
        {
          params: { currencyCode },
        }
      );

      return response.data.data;
    } catch (err) {
      const errorMessage = err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetGetCurrency } = getCurrencySlice.actions;
export default getCurrencySlice.reducer;
