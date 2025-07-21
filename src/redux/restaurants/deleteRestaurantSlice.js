//deleteRestaurantSlice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const deleteRestaurantSlice = createSlice({
  name: "deleteRestaurant",
  initialState: initialState,
  reducers: {
    resetDeleteRestaurant: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(deleteRestaurant.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteRestaurant.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const deleteRestaurant = createAsyncThunk(
  "Restaurants/DeleteRestaurantById",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(
        `${baseURL}Restaurants/DeleteRestaurantById`,
        {
          params: { restaurantId },
        }
      );

      //console.log(res.data);
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

export const { resetDeleteRestaurant } = deleteRestaurantSlice.actions;
export default deleteRestaurantSlice.reducer;
