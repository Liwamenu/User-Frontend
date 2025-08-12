import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  entities: null,
};

const getRestaurantsMapSlice = createSlice({
  name: "getRestaurantsMap",
  initialState: initialState,
  reducers: {
    resetGetRestaurantsMap: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.entities = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getRestaurantsMap.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.entities = null;
      })
      .addCase(getRestaurantsMap.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.entities = action.payload;
      })
      .addCase(getRestaurantsMap.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.entities = null;
      });
  },
});

export const getRestaurantsMap = createAsyncThunk(
  "Restaurants/getRestaurantsMap",
  async (inData, { rejectWithValue }) => {
    try {
      const uniqueRestaurantIds = [
        ...new Set(inData.map((entity) => entity.restaurantId)),
      ];

      const restaurantPromises = uniqueRestaurantIds.map((restaurantId) =>
        api
          .get(`${baseURL}Restaurants/GetRestaurantById`, {
            params: {
              restaurantId,
            },
          })
          .then((response) => response.data.data)
      );

      const restaurants = await Promise.all(restaurantPromises);

      const restaurantMap = restaurants.reduce((acc, restaurant) => {
        acc[restaurant.id] = restaurant;
        return acc;
      }, {});

      const updatedInData = inData.map((entity) => {
        const restaurant = restaurantMap[entity.restaurantId];
        return {
          ...entity,
          restaurantName: restaurant.name,
          restaurantId: restaurant.id,
        };
      });

      return updatedInData;
    } catch (err) {
      const errorMessage = err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetGetRestaurantsMap } = getRestaurantsMapSlice.actions;
export default getRestaurantsMapSlice.reducer;
