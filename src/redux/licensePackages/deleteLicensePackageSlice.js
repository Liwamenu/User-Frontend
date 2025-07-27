//deleteLicensePackageSlice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const deleteLicensePackageSlice = createSlice({
  name: "deleteLicensePackage",
  initialState: initialState,
  reducers: {
    resetDeleteLicensePackage: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(deleteLicensePackage.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteLicensePackage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteLicensePackage.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const deleteLicensePackage = createAsyncThunk(
  "LicensePackages/DeleteLicensePackageById",
  async ({ licensePackageId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(
        `${baseURL}LicensePackages/DeleteLicensePackageById`,
        {
          params: { licensePackageId },
        }
      );

      //console.log(res.data);
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

export const { resetDeleteLicensePackage } = deleteLicensePackageSlice.actions;
export default deleteLicensePackageSlice.reducer;
