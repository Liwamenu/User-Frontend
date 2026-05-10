import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { pickAxiosErrorMessage } from "../api";

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
      // Switched from a raw `axios.post(...)` to the configured `api`
      // instance so this call inherits the 30s timeout (was hanging
      // forever on backend stalls — same root cause as the register
      // "Mail Gönder" infinite spinner). The optional Bearer header is
      // attached per-request because this endpoint is sometimes called
      // unauthenticated (password reset link) and sometimes
      // authenticated (in-app password change).
      const res = await api.post(
        `${baseURL}Auth/change-password`,
        {
          currentPassword: currentPassword ?? token,
          newPassword,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      );
      return res.data;
    } catch (err) {
      console.log(err);
      const errorMessage = pickAxiosErrorMessage(err);
      const statusCode =
        err?.response?.status || err?.response?.data?.statusCode;
      return rejectWithValue({ message: errorMessage, statusCode });
    }
  },
);

export const { resetSetNewPassword } = setNewPasswordSlice.actions;
export default setNewPasswordSlice.reducer;
