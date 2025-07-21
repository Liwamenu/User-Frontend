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

const getUserRestaurantsSlice = createSlice({
  name: "GetUserRestaurants",
  initialState: initialState,
  reducers: {
    resetGetUserRestaurantsState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetUserRestaurants: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.restaurants = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getUserRestaurants.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.restaurants = null;
      })
      .addCase(getUserRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.restaurants = action.payload;
      })
      .addCase(getUserRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.restaurants = null;
      });
  },
});

export const getUserRestaurants = createAsyncThunk(
  "Restaurants/GetRestaurantsByUserId",
  async (
    {
      userId,
      pageNumber = null,
      pageSize = null,
      searchKey = null,
      active = null,
      city = null,
      district = null,
      neighbourhood = null,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(
        `${baseURL}Restaurants/GetRestaurantsByUserId`,
        {
          params: {
            userId,
            pageNumber,
            pageSize,
            searchKey,
            active,
            city,
            district,
            neighbourhood,
          },
        }
      );

      // console.log(res.data);
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

export const { resetGetUserRestaurantsState, resetGetUserRestaurants } =
  getUserRestaurantsSlice.actions;
export default getUserRestaurantsSlice.reducer;
