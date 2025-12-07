import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getSubCategoriesSlice from "./getSubCategoriesSlice";
import editSubCategoriesSlice from "./editSubCategoriesSlice";
import addSubCategoriesSlice from "./addSubCategoriesSlice";

const subCategoriesSlice = combineReducers({
  get: getSubCategoriesSlice,
  edit: editSubCategoriesSlice,
  add: addSubCategoriesSlice,
});

export default subCategoriesSlice;
