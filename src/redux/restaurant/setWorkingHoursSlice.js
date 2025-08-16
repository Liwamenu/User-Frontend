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

const setWorkingHoursSlice = createSlice({
  name: "setWorkingHours",
  initialState: initialState,
  reducers: {
    resetSetWorkingHours: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(setWorkingHours.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(setWorkingHours.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(setWorkingHours.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const setWorkingHours = createAsyncThunk(
  "Restaurants/setWorkingHours",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`${baseURL}Restaurants/SetWorkingHours`, data);

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

export const { resetSetWorkingHours } = setWorkingHoursSlice.actions;
export default setWorkingHoursSlice.reducer;
