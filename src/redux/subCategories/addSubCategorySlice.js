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

const addSubCategorySlice = createSlice({
  name: "addSubCategory",
  initialState: initialState,
  reducers: {
    resetAddSubCategory: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(addSubCategory.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const addSubCategory = createAsyncThunk(
  "SubCategories/AddSubCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `${baseURL}SubCategories/AddSubCategory`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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

export const { resetAddSubCategory } = addSubCategorySlice.actions;
export default addSubCategorySlice.reducer;
