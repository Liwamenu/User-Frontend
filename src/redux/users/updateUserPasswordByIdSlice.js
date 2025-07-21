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

const updateUserPasswordByIdSlice = createSlice({
  name: "updateUserPassword",
  initialState: initialState,
  reducers: {
    resetUpdateUserPassword: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetUpdateUserPasswordState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(updateUserPasswordById.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(updateUserPasswordById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(updateUserPasswordById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const updateUserPasswordById = createAsyncThunk(
  "Users/updateUserPassword",
  async (
    { targetUserId, newPassword, newPasswordConfirm },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(
        `${baseURL}Users/UpdateUserPasswordByUserId`,
        {
          newPassword,
          newPasswordConfirm,
        },
        {
          params: {
            targetUserId,
          },
        }
      );

      // console.log(res.data);
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

export const { resetUpdateUserPassword, resetUpdateUserPasswordState } =
  updateUserPasswordByIdSlice.actions;
export default updateUserPasswordByIdSlice.reducer;
