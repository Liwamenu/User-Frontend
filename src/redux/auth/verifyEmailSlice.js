import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const verifyEmailSlice = createSlice({
  name: "VerifyEmailSlice",
  initialState: initialState,
  reducers: {
    resetVerifyEmail: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const verifyEmail = createAsyncThunk(
  "Auth/verify-email",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`${baseURL}Auth/verify-email`, data);
      return data;
    } catch (err) {
      console.log(err);
      const errorMessage = err.response.data.message_TR || err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetVerifyEmail } = verifyEmailSlice.actions;
export default verifyEmailSlice.reducer;
