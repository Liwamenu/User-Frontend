import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const transferDealerSlice = createSlice({
  name: "transferDealer",
  initialState: initialState,
  reducers: {
    resetTransferDealerState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(transferDealer.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(transferDealer.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(transferDealer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const transferDealer = createAsyncThunk(
  "Users/DealerTransfer",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `${baseURL}Users/DealerTransfer`,
        {},
        { params: data }
      );

      return res.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        throw rejectWithValue(err.response.data);
      }
      throw rejectWithValue({ message_TR: err.message });
    }
  }
);

export const { resetTransferDealerState } = transferDealerSlice.actions;
export default transferDealerSlice.reducer;
