import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  userLicenses: null,
};

const getUserLicensesSlice = createSlice({
  name: "getUserLicenses",
  initialState: initialState,
  reducers: {
    resetGetUserLicensesState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetUserLicenses: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.userLicenses = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getUserLicenses.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.userLicenses = null;
      })
      .addCase(getUserLicenses.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.userLicenses = action.payload;
      })
      .addCase(getUserLicenses.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.userLicenses = null;
      });
  },
});

export const getUserLicenses = createAsyncThunk(
  "Licenses/GetLicensesByUserId",
  async (
    { userId, pageNumber = null, pageSize = null },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`${baseURL}Licenses/GetLicensesByUserId`, {
        params: {
          userId,
          pageNumber,
          pageSize,
        },
      });

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

export const { resetGetUserLicensesState, resetGetUserLicenses } =
  getUserLicensesSlice.actions;
export default getUserLicensesSlice.reducer;
