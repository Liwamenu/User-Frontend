import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  licensePackages: null,
};

const getLicensePackagesSlice = createSlice({
  name: "getLicensePackages",
  initialState: initialState,
  reducers: {
    resetGetLicensePackagesState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetLicensePackages: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.licensePackages = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getLicensePackages.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.licensePackages = null;
      })
      .addCase(getLicensePackages.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.licensePackages = action.payload;
      })
      .addCase(getLicensePackages.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.licensePackages = null;
      });
  },
});

export const getLicensePackages = createAsyncThunk(
  "LicensePackages/GetLicensePackages",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${baseURL}LicensePackages/GetLicensePackages`);

      // console.log(res.data);
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

export const { resetGetLicensePackagesState, resetGetLicensePackages } =
  getLicensePackagesSlice.actions;
export default getLicensePackagesSlice.reducer;
