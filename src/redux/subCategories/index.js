import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getSubCategoriesSlice from "./getSubCategoriesSlice";
import editSubCategorySlice from "./editSubCategorySlice";
import addSubCategorySlice from "./addSubCategorySlice";
import updateSubOrders from "./updateSubOrdersSlice";
import deleteSubCategorySlice from "./deleteSubCategorySlice";

const subCategoriesSlice = combineReducers({
  get: getSubCategoriesSlice,
  edit: editSubCategorySlice,
  add: addSubCategorySlice,
  delete: deleteSubCategorySlice,
  updateSubOrders: updateSubOrders,
});

export default subCategoriesSlice;
