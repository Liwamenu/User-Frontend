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

const setRestaurantThemeSlice = createSlice({
  name: "setRestaurantTheme",
  initialState: initialState,
  reducers: {
    resetSetRestaurantTheme: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(setRestaurantTheme.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(setRestaurantTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(setRestaurantTheme.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const setRestaurantTheme = createAsyncThunk(
  "Restaurants/SetRestaurantTheme",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `${baseURL}Restaurants/UpdateRestaurantTheme`,
        data,
      );

      // console.log(res);
      return res.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        throw rejectWithValue(err.response.data);
      }
      throw rejectWithValue({ message_TR: err.message });
    }
  },
);

export const { resetSetRestaurantTheme } = setRestaurantThemeSlice.actions;
export default setRestaurantThemeSlice.reducer;
