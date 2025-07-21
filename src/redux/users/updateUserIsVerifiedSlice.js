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

const updateUserIsVerifiedSlice = createSlice({
  name: "updateUserIsVerified",
  initialState: initialState,
  reducers: {
    resetUpdateUserIsVerified: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetUpdateUserIsVerifiedState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(updateUserIsVerified.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(updateUserIsVerified.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(updateUserIsVerified.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const updateUserIsVerified = createAsyncThunk(
  "Users/updateUserIsVerified",
  async ({ userId, isVerify }, { rejectWithValue }) => {
    console.log({ isVerify });
    try {
      const res = await api.put(
        `${baseURL}Users/UpdateUserIsVerify`,
        {},
        { params: { userId, isVerify } }
      );

      // console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message_TR: err.message });
    }
  }
);

export const { resetUpdateUserIsVerified, resetUpdateUserIsVerifiedState } =
  updateUserIsVerifiedSlice.actions;
export default updateUserIsVerifiedSlice.reducer;
