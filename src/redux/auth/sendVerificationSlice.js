//userVerificationSlice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const sendVerificationSlice = createSlice({
  name: "emailVerification",
  initialState: initialState,
  reducers: {
    resetSendVerification: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(sendVerificationCode.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(sendVerificationCode.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const sendVerificationCode = createAsyncThunk(
  "Auth/sendVerification",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await api.post(`${baseURL}Email/send-verification`, {
        email,
      });

      return res.data;
    } catch (err) {
      const errorMessage = err.response.data.message_TR || err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetSendVerification } = sendVerificationSlice.actions;
export default sendVerificationSlice.reducer;
