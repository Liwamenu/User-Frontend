import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: initialState,
  reducers: {
    resetForgotPassword: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.sessionId = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const forgotPassword = createAsyncThunk(
  "Auth/forgotPassword",
  async ({ toAddress }, { rejectWithValue }) => {
    try {
      const res = await api.post(`${baseURL}Email/send-password-reset`, {
        emailOrPhone: toAddress,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      const errorMessage =
        err?.response?.data?.message_TR ||
        err?.response?.data?.message ||
        err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetForgotPassword } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
