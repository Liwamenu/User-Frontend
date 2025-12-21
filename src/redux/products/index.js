import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getProductsByCategoryIdSlice from "./getProductsByCategoryIdSlice";
import getProductsSlice from "./getProductsSlice";
import updatePriceListSlice from "./updatePriceListSlice";
import addProductSlice from "./addProductSlice";
import editProductSlice from "./editProductSlice";
import deleteProductSlice from "./deleteProductSlice";

const productsSlice = combineReducers({
  get: getProductsSlice,
  add: addProductSlice,
  edit: editProductSlice,
  delete: deleteProductSlice,
  getByCategoryId: getProductsByCategoryIdSlice,
  updatePriceList: updatePriceListSlice,
});

export default productsSlice;
