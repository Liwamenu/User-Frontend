import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getWorkingHoursSlice from "./getWorkingHoursSlice";
import setWorkingHoursSlice from "./setWorkingHoursSlice";

const restaurantSlice = combineReducers({
  getWorkingHours: getWorkingHoursSlice,
  setWorkingHours: setWorkingHoursSlice,
});

export default restaurantSlice;
