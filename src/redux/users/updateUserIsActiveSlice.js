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

const updateUserIsActiveSlice = createSlice({
  name: "updateUserIsActive",
  initialState: initialState,
  reducers: {
    resetUpdateUserIsActive: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetUpdateUserIsActiveState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(updateUserIsActive.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(updateUserIsActive.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(updateUserIsActive.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const updateUserIsActive = createAsyncThunk(
  "Users/updateUserIsActive",
  async ({ userId, isActive, passiveNote }, { rejectWithValue }) => {
    console.log(userId, isActive, passiveNote);
    try {
      const res = await api.put(
        `${baseURL}Users/UpdateUserIsActive`,
        {},
        { params: { userId, isActive, passiveNote } }
      );

      console.log(res);
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

export const { resetUpdateUserIsActive, resetUpdateUserIsActiveState } =
  updateUserIsActiveSlice.actions;
export default updateUserIsActiveSlice.reducer;
