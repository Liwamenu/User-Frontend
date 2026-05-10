import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getCategoriesSlice from "./getCategoriesSlice";
import editCategoriesSlice from "./editCategoriesSlice";
import addCategoriesSlice from "./addCategoriesSlice";
import addCategorySlice from "./addCategorySlice";
import editCategorySlice from "./editCategorySlice";
import deleteCategorySlice from "./deleteCategorySlice";

const categoriesSlice = combineReducers({
  get: getCategoriesSlice,
  edit: editCategoriesSlice,
  add: addCategoriesSlice,
  // Sub-slice key was previously misspelled as `addCatergory`. Fixed
  // here + at every consumer (addCategory.jsx selector, t() key) so
  // the typo no longer leaks into the toast text shown to users.
  addCategory: addCategorySlice,
  editCategory: editCategorySlice,
  deleteCategory: deleteCategorySlice,
});

export default categoriesSlice;
