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

const updateUserInvoiceSlice = createSlice({
  name: "updateUserInvoice",
  initialState: initialState,
  reducers: {
    resetUpdateUserInvoice: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetUpdateUserInvoiceState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(updateUserInvoice.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(updateUserInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(updateUserInvoice.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const updateUserInvoice = createAsyncThunk(
  "Users/updateUserInvoice",
  async (
    {
      taxOffice,
      taxNumber,
      title,
      address,
      city,
      district,
      neighbourhood,
      tradeRegistryNumber,
      mersisNumber,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`${baseURL}Invoices/UpdateUserInvoiceAddress`, {
        taxOffice,
        taxNumber,
        title,
        address,
        city: city.label,
        district: district.label,
        neighbourhood: neighbourhood.label,
        tradeRegistryNumber,
        mersisNumber,
      });

      // console.log(res.data);
      return res.data;
    } catch (err) {
      const errorMessage = err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetUpdateUserInvoice, resetUpdateUserInvoiceState } =
  updateUserInvoiceSlice.actions;
export default updateUserInvoiceSlice.reducer;
