import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const logoutSlice = createSlice({
  name: "Logout",
  initialState: initialState,
  reducers: {
    resetLogoutState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const logout = createAsyncThunk(
  "Auth/UserLogout",
  async ({ userSessionId }, { rejectWithValue }) => {
    try {
      console.log(userSessionId);
      const res = await api.delete(
        `${baseURL}UserSessions/DeleteUserSessionById`,
        {
          params: { userSessionId },
        }
      );

      // console.log(res.data);
      return res.data;
    } catch (err) {
      const errorMessage = err.message;
      return rejectWithValue({ message: errorMessage });
    }

    //await new Promise((resolve) => setTimeout(resolve, 1000));
    //return null;
  }
);

export const { resetLogoutState } = logoutSlice.actions;
export default logoutSlice.reducer;
