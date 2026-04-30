import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getProductsByCategoryIdSlice from "./getProductsByCategoryIdSlice";
import getProductsSlice from "./getProductsSlice";
import getProductsLiteSlice from "./getProductsLiteSlice";
import updatePriceListSlice from "./updatePriceListSlice";
import addProductSlice from "./addProductSlice";
import editProductSlice from "./editProductSlice";
import deleteProductSlice from "./deleteProductSlice";
import priceListApplyBulkSlice from "./priceListApplyBulkSlice";

const productsSlice = combineReducers({
  get: getProductsSlice,
  // Lite (id+name+categoryId+portions) list — used by Order Tags and
  // any other consumer that only needs dropdown data, not the full
  // product DTO. See getProductsLiteSlice.js for the cache contract.
  getLite: getProductsLiteSlice,
  add: addProductSlice,
  edit: editProductSlice,
  delete: deleteProductSlice,
  getByCategoryId: getProductsByCategoryIdSlice,
  updatePriceList: updatePriceListSlice,
  applyPriceListBulk: priceListApplyBulkSlice,
});

export default productsSlice;
