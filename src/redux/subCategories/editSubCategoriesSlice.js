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

const editSubCategoriesSlice = createSlice({
  name: "editSubCategories",
  initialState: initialState,
  reducers: {
    resetEditSubCategories: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(editSubCategories.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(editSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(editSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const editSubCategories = createAsyncThunk(
  "SubCategories/EditSubCategories",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `${baseURL}SubCategories/EditSubCategories`,
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

export const { resetEditSubCategories } = editSubCategoriesSlice.actions;
export default editSubCategoriesSlice.reducer;
