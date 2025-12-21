import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getCategoriesSlice from "./getCategoriesSlice";
import editCategoriesSlice from "./editCategoriesSlice";
import addCategoriesSlice from "./addCategoriesSlice";
import addCatergorySlice from "./addCategorySlice";
import editCategorySlice from "./editCategorySlice";
import deleteCategorySlice from "./deleteCategorySlice";

const categoriesSlice = combineReducers({
  get: getCategoriesSlice,
  edit: editCategoriesSlice,
  add: addCategoriesSlice,
  addCatergory: addCatergorySlice,
  editCategory: editCategorySlice,
  deleteCategory: deleteCategorySlice,
});

export default categoriesSlice;
