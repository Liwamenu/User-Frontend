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

const editCategorySlice = createSlice({
  name: "editCategory",
  initialState: initialState,
  reducers: {
    resetEditCategory: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const editCategory = createAsyncThunk(
  "Categories/EditCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`${baseURL}Categories/EditCategory`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(data);
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

export const { resetEditCategory } = editCategorySlice.actions;
export default editCategorySlice.reducer;
