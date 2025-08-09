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

const updateUserDataSlice = createSlice({
  name: "updateUserData",
  initialState: initialState,
  reducers: {
    resetUpdateUserData: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetUpdateUserDataState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const updateUserData = createAsyncThunk(
  "Users/UpdateUser",
  async (
    { dealerId, email, phoneNumber, firstName, lastName, city, district },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`${baseURL}Users/UpdateUser`, {
        dealerId,
        email,
        phoneNumber,
        firstName,
        lastName,
        city: city.label,
        district: district.label,
      });

      // console.log(res.data);
      return res.data;
    } catch (err) {
      const errorMessage = err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetUpdateUserData, resetUpdateUserDataState } =
  updateUserDataSlice.actions;
export default updateUserDataSlice.reducer;
