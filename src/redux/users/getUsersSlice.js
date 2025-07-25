//https://api.pentegrasyon.net:9007/api/v1/Users/GetUsers

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";
import toast from "react-hot-toast";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  users: null,
  dealers: null,
};

const getUsersSlice = createSlice({
  name: "getUsers",
  initialState: initialState,
  reducers: {
    resetGetUsersState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetUsers: (state) => {
      state.users = null;
    },
    resetDealers: (state) => {
      state.dealers = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.users = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.users = null;
      })
      .addCase(getDealers.fulfilled, (state, action) => {
        state.dealers = action.payload;
      });
  },
});

export const getUsers = createAsyncThunk(
  "Users/GetUsers",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.get(`${baseURL}Users/GetUsers`, {
        params: data,
      });

      // console.log(res);
      return res?.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        throw rejectWithValue(err.response.data);
      }
      throw rejectWithValue({ message_TR: err.message });
    }
  }
);

export const getDealers = createAsyncThunk(
  "Users/GetDealers",
  async ({ dealer }, { rejectWithValue }) => {
    try {
      const res = await api.get(`${baseURL}Users/GetUsers`, {
        params: {
          dealer,
        },
      });

      //console.log(res.data.data);
      return res?.data?.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        throw rejectWithValue(err.response.data);
      }
      throw rejectWithValue({ message_TR: err.message });
    }
  }
);

export const { resetGetUsersState, resetGetUsers, resetDealers } =
  getUsersSlice.actions;
export default getUsersSlice.reducer;
