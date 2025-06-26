import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const registerSlice = createSlice({
  name: "registerUser",
  initialState: initialState,
  reducers: {
    resetRgister: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetRgisterState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const registerUser = createAsyncThunk(
  "Auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`${baseURL}Auth/register`, data);

      return res.data;
    } catch (err) {
      const errorMessage = err.response.data.message || err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetRgister, resetRgisterState } = registerSlice.actions;
export default registerSlice.reducer;
