//https://api.pentegrasyon.net:9007/api/v1/user/getUser

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  user: null,
};

const getUserSlice = createSlice({
  name: "getUser",
  initialState: initialState,
  reducers: {
    resetGetUserState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetUser: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.user = null;
      });
  },
});

export const getUser = createAsyncThunk(
  "User/GetUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${baseURL}Users/GetUser`);

      //console.log(res);
      return res?.data?.data;
    } catch (err) {
      const errorMessage = err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetGetUserState, resetGetUser } = getUserSlice.actions;
export default getUserSlice.reducer;
