import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const deleteProductSlice = createSlice({
  name: "deleteProduct",
  initialState,
  reducers: {
    resetDeleteProduct: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const deleteProduct = createAsyncThunk(
  "Products/DeleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${baseURL}Products/DeleteProduct/${productId}`,
      );
      return response.data;
    } catch (error) {
      // `error.response` is undefined on CORS / network failures
      // (e.g. server returns 5xx without proper CORS headers). Surface a
      // sensible message instead of crashing the thunk.
      const payload = error.response?.data || {
        message_TR:
          "Ürün silinemedi. Bu ürünün geçmiş siparişlerle bağlantısı olabilir veya sunucu hatası oluştu.",
        message:
          "Could not delete product. It may be linked to past orders or a server error occurred.",
      };
      return rejectWithValue(payload);
    }
  },
);

export const { resetDeleteProduct } = deleteProductSlice.actions;

export default deleteProductSlice.reducer;
