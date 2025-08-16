import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getWorkingHoursSlice from "./getWorkingHoursSlice";
import setWorkingHoursSlice from "./setWorkingHoursSlice";
import getSocialMediasSlice from "./getSocialMediasSlice";
import setSocialMediasSlice from "./setSocialMediasSlice";

const restaurantSlice = combineReducers({
  getWorkingHours: getWorkingHoursSlice,
  setWorkingHours: setWorkingHoursSlice,
  getSocialMedias: getSocialMediasSlice,
  setSocialMedias: setSocialMediasSlice,
});

export default restaurantSlice;
