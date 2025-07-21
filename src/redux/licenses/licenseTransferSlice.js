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

const licenseTransferSlice = createSlice({
  name: "licenseTransfer",
  initialState: initialState,
  reducers: {
    resetLicenseTransfer: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(licenseTransfer.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(licenseTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(licenseTransfer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const licenseTransfer = createAsyncThunk(
  "Licenses/LicenseTransfer",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`${baseURL}Licenses/LicenseTransfer`, data, {
        params: data,
      });

      // console.log(res);
      return res.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        throw rejectWithValue(err.response.data);
      }
      throw rejectWithValue({ message_TR: err.message });
    }
  }
);

export const { resetLicenseTransfer } = licenseTransferSlice.actions;
export default licenseTransferSlice.reducer;
