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

const deleteOrderTagSlice = createSlice({
  name: "deleteOrderTag",
  initialState,
  reducers: {
    resetDeleteOrderTag: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteOrderTag.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(deleteOrderTag.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(deleteOrderTag.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const deleteOrderTag = createAsyncThunk(
  "OrderTags/DeleteOrderTag",
  async (orderTagId, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${baseURL}OrderTags/DeleteOrderTag/${orderTagId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const { resetDeleteOrderTag } = deleteOrderTagSlice.actions;

export default deleteOrderTagSlice.reducer;
