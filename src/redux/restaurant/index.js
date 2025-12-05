import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getWorkingHoursSlice from "./getWorkingHoursSlice";
import setWorkingHoursSlice from "./setWorkingHoursSlice";
import getSocialMediasSlice from "./getSocialMediasSlice";
import setSocialMediasSlice from "./setSocialMediasSlice";
import getPaymentMethodsSlice from "./getPaymentMethodsSlice";
import setPaymentMethodsSlice from "./setPaymentMethodsSlice";
import setRestaurantSettings from "./setRestaurantSettingsSlice";

const restaurantSlice = combineReducers({
  getWorkingHours: getWorkingHoursSlice,
  setWorkingHours: setWorkingHoursSlice,
  getSocialMedias: getSocialMediasSlice,
  setSocialMedias: setSocialMediasSlice,
  getPaymentMethods: getPaymentMethodsSlice,
  setPaymentMethods: setPaymentMethodsSlice,
  setRestaurantSettings: setRestaurantSettings,
});

export default restaurantSlice;
