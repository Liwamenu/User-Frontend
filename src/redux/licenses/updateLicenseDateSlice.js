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

const updateLicenseDateSlice = createSlice({
  name: "updateLicenseDate",
  initialState: initialState,
  reducers: {
    resetUpdateLicenseDate: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetUpdateLicenseDateState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(updateLicenseDate.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(updateLicenseDate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(updateLicenseDate.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const updateLicenseDate = createAsyncThunk(
  "Licenses/UpdateLicenseDate",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `${baseURL}Licenses/UpdateLicenseDate`,
        {},
        { params: data }
      );

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

export const updateLicenseDay = createAsyncThunk(
  "Licenses/UpdateLicenseDay",
  async ({ licenseId, day }, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `${baseURL}Licenses/UpdateLicenseDay`,
        {},
        { params: { licenseId, day } }
      );

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

export const { resetUpdateLicenseDate, resetUpdateLicenseDateState } =
  updateLicenseDateSlice.actions;
export default updateLicenseDateSlice.reducer;
