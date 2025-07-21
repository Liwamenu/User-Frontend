import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  waitingLicenses: null,
};

const getWaitingYemekSepetiLicensesSlice = createSlice({
  name: "getWaitingYemekSepetiLicenses",
  initialState: initialState,
  reducers: {
    resetGetWaitingYemekSepetiLicenses: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.waitingLicenses = null;
    },
    resetGetWaitingYemekSepetiLicensesStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getWaitingYemekSepetiLicenses.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.waitingLicenses = null;
      })
      .addCase(getWaitingYemekSepetiLicenses.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.waitingLicenses = action.payload;
      })
      .addCase(getWaitingYemekSepetiLicenses.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.waitingLicenses = null;
      });
  },
});

export const getWaitingYemekSepetiLicenses = createAsyncThunk(
  "Licenses/GetWaitingYemekSepetiLicenses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `${baseURL}Licenses/GetWaitingYemekSepetiLicenses`,
        {}
      );

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

export const {
  resetGetWaitingYemekSepetiLicenses,
  resetGetWaitingYemekSepetiLicensesStatus,
} = getWaitingYemekSepetiLicensesSlice.actions;
export default getWaitingYemekSepetiLicensesSlice.reducer;
