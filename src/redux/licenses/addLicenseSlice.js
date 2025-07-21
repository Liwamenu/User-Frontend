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

const addLicenseSlice = createSlice({
  name: "addLicense",
  initialState: initialState,
  reducers: {
    resetAddLicense: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetAddLicenseState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(addLicense.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(addLicense.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(addLicense.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const addLicense = createAsyncThunk(
  "Licenses/AddLicense",
  async (
    {
      restaurantId,
      userId,
      marketplaceId,
      startDateTime,
      endDateTime,
      isActive,
      licensePackageTime,
      licensePackageTotalPrice,
      licensePackageId,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(`${baseURL}Licenses/AddLicense`, {
        restaurantId,
        userId,
        marketplaceId,
        startDateTime,
        endDateTime,
        isActive,
        licensePackageTime,
        licensePackageTotalPrice,
        licensePackageId,
      });

      // console.log(res);
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

export const { resetAddLicense, resetAddLicenseState } =
  addLicenseSlice.actions;
export default addLicenseSlice.reducer;
