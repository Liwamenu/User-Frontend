//https://api.pentegrasyon.net:9007/api/v1/user/getUserLock

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  data: null,
};

const getUserLockSlice = createSlice({
  name: "getUserLock",
  initialState: initialState,
  reducers: {
    resetgetUserLock: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getUserLock.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.data = null;
      })
      .addCase(getUserLock.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.data = action.payload;
      })
      .addCase(getUserLock.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const getUserLock = createAsyncThunk(
  "Users/GetUserLock",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${baseURL}Users/GetUserLock`);

      //console.log(res);
      return res?.data?.data;
    } catch (err) {
      const errorMessage = err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetgetUserLock } = getUserLockSlice.actions;
export default getUserLockSlice.reducer;
