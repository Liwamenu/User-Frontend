import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  data: null,
  kdv: {
    loading: false,
    success: false,
    error: false,
    data: null,
  },
};

const updateLicensePackageSlice = createSlice({
  name: "updateLicensePackage",
  initialState: initialState,
  reducers: {
    resetUpdateLicensePackageState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetUpdateLicensePackage: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetUpdateLicensePackageKDV: (state) => {
      state.kdv.loading = false;
      state.kdv.success = false;
      state.kdv.error = null;
      state.kdv.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(updateLicensePackage.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.data = null;
      })
      .addCase(updateLicensePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.data = action.payload;
      })
      .addCase(updateLicensePackage.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      })
      .addCase(updateLicensePackageKDV.pending, (state) => {
        state.kdv.loading = true;
        state.kdv.success = false;
        state.kdv.error = false;
        state.kdv.data = null;
      })
      .addCase(updateLicensePackageKDV.fulfilled, (state, action) => {
        state.kdv.loading = false;
        state.kdv.success = true;
        state.kdv.error = false;
        state.kdv.data = action.payload;
      })
      .addCase(updateLicensePackageKDV.rejected, (state, action) => {
        state.kdv.loading = true;
        state.kdv.success = false;
        state.kdv.error = action.payload;
        state.kdv.data = null;
      });
  },
});

export const updateLicensePackage = createAsyncThunk(
  "LicensePackages/UpdateLicensePackage",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `${baseURL}LicensePackages/UpdateLicensePackage`,
        { ...data },
        {
          params: { ...data },
        }
      );

      // console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message_TR: err.message });
    }
  }
);

export const updateLicensePackageKDV = createAsyncThunk(
  "LicensePackages/UpdateLicensePackageKDV",
  async ({ kdv }, { rejectWithValue }) => {
    try {
      console.log({ kdv });
      const res = await api.put(
        `${baseURL}LicensePackages/UpdateLicensePackageKDV`,
        {},
        {
          params: { kdv },
        }
      );

      // console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message_TR: err.message });
    }
  }
);

export const {
  resetUpdateLicensePackageState,
  resetUpdateLicensePackage,
  resetUpdateLicensePackageKDV,
} = updateLicensePackageSlice.actions;
export default updateLicensePackageSlice.reducer;
