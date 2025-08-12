//https://api.pentegrasyon.net:9007/api/v1/Users/GetUsers

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  restaurants: null,
};

const getRestaurantsSlice = createSlice({
  name: "getRestaurants",
  initialState: initialState,
  reducers: {
    resetGetRestaurantsState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetRestaurants: (state) => {
      state.restaurants = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getRestaurants.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.restaurants = null;
      })
      .addCase(getRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.restaurants = action.payload;
      })
      .addCase(getRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.restaurants = null;
      });
  },
});

export const getRestaurants = createAsyncThunk(
  "Restaurants/getRestaurants",
  async (
    {
      pageNumber = 0,
      pageSize = 0,
      searchKey = null,
      active = null,
      city = null,
      district = null,
      neighbourhood = null,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`${baseURL}Restaurants/GetmyRestaurants`, {
        params: {
          pageNumber,
          pageSize,
          searchKey,
          active,
          city,
          district,
          neighbourhood,
        },
      });

      // console.log(res);
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

export const { resetGetRestaurantsState, resetGetRestaurants } =
  getRestaurantsSlice.actions;
export default getRestaurantsSlice.reducer;
