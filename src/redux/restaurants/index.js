import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getRestaurantSlice from "./getRestaurantSlice";
import getRestaurantsSlice from "./getRestaurantsSlice";
import getUserRestaurantsSlice from "./getUserRestaurantsSlice";
import deleteRestaurantSlice from "./deleteRestaurantSlice";
import updateRestaurantSlice from "./updateRestaurantSlice";
import addRestaurantSlice from "./addRestaurantSlice";
import restaurantTransferSlice from "./restaurantTransferSlice";

const restaurantsSlice = combineReducers({
  getRestaurant: getRestaurantSlice,
  getRestaurants: getRestaurantsSlice,
  getUserRestaurants: getUserRestaurantsSlice,
  deleteRestaurant: deleteRestaurantSlice,
  updateRestaurant: updateRestaurantSlice,
  addRestaurant: addRestaurantSlice,
  restaurantTransfer: restaurantTransferSlice,
});

export default restaurantsSlice;
