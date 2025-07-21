//https://api.pentegrasyon.net:9007/api/v1/admin/getAdmin

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  admin: null,
};

const getAdminSlice = createSlice({
  name: "getAdmin",
  initialState: initialState,
  reducers: {
    resetGetAdminState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetAdmin: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.admin = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getAdmin.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.admin = null;
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.admin = action.payload;
      })
      .addCase(getAdmin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.admin = null;
      });
  },
});

export const getAdmin = createAsyncThunk(
  "Managers/GetManager",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${baseURL}Managers/GetManager`);

      // console.log(res.data?.data);
      return res?.data?.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message_TR: err.message });
    }
  }
);

export const { resetGetAdminState, resetGetAdmin } = getAdminSlice.actions;
export default getAdminSlice.reducer;
