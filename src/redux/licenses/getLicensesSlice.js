import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  licenses: null,
};

const getLicensesSlice = createSlice({
  name: "getLicenses",
  initialState: initialState,
  reducers: {
    resetGetLicensesState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetLicenses: (state) => {
      state.licenses = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getLicenses.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.licenses = null;
      })
      .addCase(getLicenses.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.licenses = action.payload;
      })
      .addCase(getLicenses.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.licenses = null;
      });
  },
});

export const getLicenses = createAsyncThunk(
  "Licenses/GetLicenses",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.get(`${baseURL}Licenses/GetmyLicenses`, {
        params: data,
      });

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

export const { resetGetLicensesState, resetGetLicenses } =
  getLicensesSlice.actions;
export default getLicensesSlice.reducer;
