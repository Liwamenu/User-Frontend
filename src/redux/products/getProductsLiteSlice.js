// Lite product list — backed by `Products/GetProductsByRestaurantIdLite`,
// added by the backend per BACKEND_PERFORMANCE_REQUEST.md to support
// dropdown-style consumers (Order Tags relation row, future ones) that
// only need {id, name, categoryId, portions:[{id,name}]} per product.
//
// The endpoint returns the *entire* product list in a single response
// (no pagination), so this slice stores a flat array of lite products
// and uses a simple `fetchedFor === restaurantId` cache key — same
// pattern as Categories / SubCategories / Menus / OrderTags slices.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  // Flat array of lite products: [{ id, name, categoryId, portions:
  // [{ id, name }] }, ...]. Null until the first successful fetch.
  products: null,
  // Restaurant the cached `products` belongs to. Lets call sites skip
  // refetching when revisiting within the same restaurant.
  fetchedFor: null,
};

export const getProductsLite = createAsyncThunk(
  "Products/GetProductsByRestaurantIdLite",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `${baseURL}Products/GetProductsByRestaurantIdLite`,
        { params: data },
      );
      // Endpoint returns { data: ProductLite[], totalCount }. Some
      // backends omit the wrapper for unpaged endpoints; tolerate both.
      return res?.data?.data ?? res?.data ?? [];
    } catch (err) {
      if (err?.response?.data) return rejectWithValue(err.response.data);
      return rejectWithValue({ message_TR: err.message });
    }
  },
);

const getProductsLiteSlice = createSlice({
  name: "getProductsLite",
  initialState,
  reducers: {
    resetGetProductsLite: (state) => {
      state.products = null;
      state.fetchedFor = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getProductsLite.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        // Stale-while-revalidate: keep the previous payload visible
        // while the refetch is in flight.
      })
      .addCase(getProductsLite.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.products = action.payload;
        state.fetchedFor = action.meta?.arg?.restaurantId ?? null;
      })
      .addCase(getProductsLite.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.products = null;
        state.fetchedFor = null;
      })
      // Auto-invalidate on any product mutation, no matter where it
      // came from. Without this, editing a product on the Products page
      // would leave Order Tags with stale dropdown labels until the
      // user manually refreshes. The thunk type strings are matched
      // exactly so a typo here would silently disable invalidation —
      // keep them in sync with the createAsyncThunk type prefixes in
      // addProductSlice / editProductSlice / deleteProductSlice.
      .addMatcher(
        (action) =>
          action.type === "Products/AddProduct/fulfilled" ||
          action.type === "Products/EditProduct/fulfilled" ||
          action.type === "Products/DeleteProduct/fulfilled",
        (state) => {
          state.products = null;
          state.fetchedFor = null;
        },
      );
  },
});

export const { resetGetProductsLite } = getProductsLiteSlice.actions;
export default getProductsLiteSlice.reducer;
