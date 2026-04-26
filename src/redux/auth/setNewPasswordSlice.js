import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const setNewPasswordSlice = createSlice({
  name: "setNewPassword",
  initialState,
  reducers: {
    resetSetNewPassword: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(setNewPassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(setNewPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(setNewPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const setNewPassword = createAsyncThunk(
  "Auth/setNewPassword",
  async ({ token, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${baseURL}Auth/change-password`,
        {
          currentPassword: currentPassword ?? token,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      return res.data;
    } catch (err) {
      console.log(err);
      const errorMessage =
        err?.response?.data?.message_TR ||
        err?.response?.data?.message ||
        err.message;
      const statusCode =
        err?.response?.status || err?.response?.data?.statusCode;
      return rejectWithValue({ message: errorMessage, statusCode });
    }
  },
);

export const { resetSetNewPassword } = setNewPasswordSlice.actions;
export default setNewPasswordSlice.reducer;
