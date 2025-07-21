import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const updateAdminPasswordSlice = createSlice({
  name: "updateAdminPassword",
  initialState: initialState,
  reducers: {
    resetUpdateAdminPassword: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetUpdateAdminPasswordState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(updateAdminPassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(updateAdminPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(updateAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const updateAdminPassword = createAsyncThunk(
  "Managers/UpdateManagerPassword",
  async ({ newPassword, newPasswordConfirm }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${baseURL}Managers/UpdateManagerPassword`, {
        newPassword,
        newPasswordConfirm,
      });

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

export const { resetUpdateAdminPassword, resetUpdateAdminPasswordState } =
  updateAdminPasswordSlice.actions;
export default updateAdminPasswordSlice.reducer;
