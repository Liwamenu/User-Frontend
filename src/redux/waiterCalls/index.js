import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getWaiterCallsSlice from "./getWaiterCallsSlice";
import resolveWaiterCallSlice from "./resolveWaiterCallSlice";

const waiterCallsSlice = combineReducers({
  get: getWaiterCallsSlice,
  resolve: resolveWaiterCallSlice,
});

export default waiterCallsSlice;
