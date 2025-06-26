import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const verifyCodeSlice = createSlice({
  name: "VerifyCode",
  initialState: initialState,
  reducers: {
    resetVerifyCodeState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(codeVerification.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(codeVerification.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(codeVerification.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const codeVerification = createAsyncThunk(
  "Auth/VerifyCode",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.get(`${baseURL}Users/verify-email`, {
        params: data,
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

export const { resetVerifyCodeState } = verifyCodeSlice.actions;
export default verifyCodeSlice.reducer;
