import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { pickAxiosErrorMessage } from "../api";

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
      console.log(err);
      // pickAxiosErrorMessage covers all the failure shapes the public
      // Auth endpoints have produced in the wild:
      //   1. Backend envelope {message_TR, message_EN} (any casing)
      //   2. Axios timeout (ECONNABORTED) → translated apiErrors.timeout
      //   3. Network failure (no response) → translated apiErrors.network
      //   4. Anything else → err.message or generic fallback
      // Without this the duplicate-user case crashed on .message_TR of
      // undefined and a backend hang surfaced as an infinite spinner
      // (no /rejected ever fired with a useful message).
      return rejectWithValue({ message: pickAxiosErrorMessage(err) });
    }
  },
);

export const { resetRgister, resetRgisterState } = registerSlice.actions;
export default registerSlice.reducer;
