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

const addLicensePackageSlice = createSlice({
  name: "addLicensePackage",
  initialState: initialState,
  reducers: {
    resetAddLicensePackageState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetAddLicensePackage: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.licensePackages = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(addLicensePackage.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.licensePackages = null;
      })
      .addCase(addLicensePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.licensePackages = action.payload;
      })
      .addCase(addLicensePackage.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.licensePackages = null;
      });
  },
});

export const addLicensePackage = createAsyncThunk(
  "LicensePackages/AddLicensePackages",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `${baseURL}LicensePackages/AddLicensePackages`,
        data
      );

      console.log(res.data);
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

export const { resetAddLicensePackageState, resetAddLicensePackage } =
  addLicensePackageSlice.actions;
export default addLicensePackageSlice.reducer;
