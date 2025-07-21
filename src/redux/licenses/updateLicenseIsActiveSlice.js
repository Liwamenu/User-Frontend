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

const updateLicenseIsActiveSlice = createSlice({
  name: "updateLicenseIsActive",
  initialState: initialState,
  reducers: {
    resetUpdateLicenseIsActive: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetUpdateLicenseIsActiveState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(updateLicenseIsActive.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(updateLicenseIsActive.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(updateLicenseIsActive.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const updateLicenseIsActive = createAsyncThunk(
  "Licenses/UpdateLicenseActive",
  async ({ licenseId, active }, { rejectWithValue }) => {
    try {
      console.log(licenseId, active);
      const res = await api.put(
        `${baseURL}Licenses/UpdateLicenseActive`,
        {},
        {
          params: { licenseId, active },
        }
      );

      console.log(res);
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

export const { resetUpdateLicenseIsActive, resetUpdateLicenseIsActiveState } =
  updateLicenseIsActiveSlice.actions;
export default updateLicenseIsActiveSlice.reducer;
