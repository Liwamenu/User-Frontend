import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getCategoriesSlice from "./getCategoriesSlice";
import editCategoriesSlice from "./editCategoriesSlice";
import addCategoriesSlice from "./addCategoriesSlice";

const categoriesSlice = combineReducers({
  get: getCategoriesSlice,
  edit: editCategoriesSlice,
  add: addCategoriesSlice,
});

export default categoriesSlice;
