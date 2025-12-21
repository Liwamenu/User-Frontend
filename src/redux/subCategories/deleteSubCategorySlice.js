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

const deleteSubCategorySlice = createSlice({
  name: "deleteSubCategory",
  initialState,
  reducers: {
    resetDeleteSubCategory: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const deleteSubCategory = createAsyncThunk(
  "SubCategories/DeleteSubCategory",
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${baseURL}SubCategories/DeleteSubCategory/${subCategoryId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const { resetDeleteSubCategory } = deleteSubCategorySlice.actions;

export default deleteSubCategorySlice.reducer;
