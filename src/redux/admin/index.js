import { combineReducers } from "@reduxjs/toolkit";

//Slices
import getAdminSlice from "./getAdminSlice";
import updateAdminDataSlice from "./updateAdminDataSlice";
import updateAdminPasswordSlice from "./updateAdminPasswordSlice";

const adminSlice = combineReducers({
  getAdmin: getAdminSlice,
  updateAdminData: updateAdminDataSlice,
  updatePassword: updateAdminPasswordSlice,
});

export default adminSlice;
