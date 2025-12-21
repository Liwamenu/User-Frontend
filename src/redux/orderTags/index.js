import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getOrderTagsSlice from "./getOrderTagsSlice";
import deleteOrderTagSlice from "./deleteOrderTagSlice";
import editOrderTagSlice from "./editOrderTagSlice";
import editOrderTagsSlice from "./editOrderTagsSlice";

const orderTagsSlice = combineReducers({
  get: getOrderTagsSlice,
  edit: editOrderTagSlice,
  delete: deleteOrderTagSlice,
  editAll: editOrderTagsSlice,
});

export default orderTagsSlice;
