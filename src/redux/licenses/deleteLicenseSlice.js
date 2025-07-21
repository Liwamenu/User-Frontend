//deleteLicenseSlice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const deleteLicenseSlice = createSlice({
  name: "deleteLicense",
  initialState: initialState,
  reducers: {
    resetDeleteLicense: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(deleteLicense.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteLicense.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteLicense.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const deleteLicense = createAsyncThunk(
  "Licenses/DeleteLicenseById",
  async ({ licenseId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`${baseURL}Licenses/DeleteLicenseById`, {
        params: { licenseId },
      });

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

export const { resetDeleteLicense } = deleteLicenseSlice.actions;
export default deleteLicenseSlice.reducer;
