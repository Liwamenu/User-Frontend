import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getMenusSlice from "./getMenusSlice";
import addMenuSlice from "./addMenuSlice";
import deleteMenuSlice from "./deleteMenuSlice";
import editMenuSlice from "./editMenuSlice";

const menusSlice = combineReducers({
  get: getMenusSlice,
  add: addMenuSlice,
  delete: deleteMenuSlice,
  edit: editMenuSlice,
});

export default menusSlice;
