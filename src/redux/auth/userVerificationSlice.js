//userVerificationSlice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const userVerificationSlice = createSlice({
  name: "userVerification",
  initialState: initialState,
  reducers: {
    resetUserVerification: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(sendUserVerificationCode.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.sessionId = null;
      })
      .addCase(sendUserVerificationCode.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(sendUserVerificationCode.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const sendUserVerificationCode = createAsyncThunk(
  "Auth/verifyUser",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await api.get(`${baseURL}Email/SendEmailUserVerify`, {
        params: {
          email,
        },
      });

      let data;
      if (res.data?.data?.token) {
        const {
          data: { token },
          ...rest
        } = res.data;
        data = { token, ...rest };
      } else {
        data = res.data;
      }
      const KEY = import.meta.env.VITE_LOCAL_KEY;
      localStorage.setItem(`${KEY}`, JSON.stringify(data));
      // console.log(res.data);
      return data;
    } catch (err) {
      const errorMessage = err.response.data.message_TR || err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetUserVerification } = userVerificationSlice.actions;
export default userVerificationSlice.reducer;
