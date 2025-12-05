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
const setRestaurantSettingsSlice = createSlice({
  name: "setRestaurantSettings",
  initialState: initialState,
  reducers: {
    resetSetRestaurantSettings: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(setRestaurantSettings.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(setRestaurantSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(setRestaurantSettings.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const setRestaurantSettings = createAsyncThunk(
  "Restaurants/SetRestaurantSettings",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `${baseURL}Restaurants/SetRestaurantSettings`,
        data
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
  }
);

export const { resetSetRestaurantSettings } =
  setRestaurantSettingsSlice.actions;
export default setRestaurantSettingsSlice.reducer;
