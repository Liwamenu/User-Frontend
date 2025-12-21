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

const deleteMenuSlice = createSlice({
  name: "deleteMenu",
  initialState,
  reducers: {
    resetDeleteMenu: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteMenu.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const deleteMenu = createAsyncThunk(
  "Menus/DeleteMenu",
  async (menuId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${baseURL}Menus/DeleteMenu/${menuId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const { resetDeleteMenu } = deleteMenuSlice.actions;

export default deleteMenuSlice.reducer;
