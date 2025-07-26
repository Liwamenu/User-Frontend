import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const deleteUserSlice = createSlice({
  name: "DeleteUser",
  initialState: initialState,
  reducers: {
    resetDeleteUser: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const deleteUser = createAsyncThunk(
  "Users/DeleteUserById",
  async ({ userId }, { rejectWithValue }) => {
    try {
      console.log(userId);
      const res = await api.delete(`${baseURL}Users/DeleteUserById`, {
        params: { userId },
      });

      //console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message_TR: err.message });
    }
  }
);

export const { resetDeleteUser } = deleteUserSlice.actions;
export default deleteUserSlice.reducer;
