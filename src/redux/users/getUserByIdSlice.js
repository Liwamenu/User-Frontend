//https://api.pentegrasyon.net:9007/api/v1/User/GetUser

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../api";

const api = privateApi();
const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  error: false,
  user: null,
  mergedUsers: {
    loading: false,
    success: false,
    error: false,
    users: null,
  },
};

const getUserByIdSlice = createSlice({
  name: "getUser",
  initialState: initialState,
  reducers: {
    resetgetUserState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetgetUser: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.user = null;
    },
    resetGetMergedUsers: (state) => {
      state.mergedUsers.loading = false;
      state.mergedUsers.success = false;
      state.mergedUsers.error = false;
      state.mergedUsers.users = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(getMergedUsers.pending, (state) => {
        state.mergedUsers.loading = true;
        state.mergedUsers.success = false;
        state.mergedUsers.error = null;
        state.mergedUsers.users = null;
      })
      .addCase(getMergedUsers.fulfilled, (state, action) => {
        state.mergedUsers.loading = false;
        state.mergedUsers.success = true;
        state.mergedUsers.error = null;
        state.mergedUsers.users = action.payload;
      })
      .addCase(getMergedUsers.rejected, (state, action) => {
        state.mergedUsers.loading = false;
        state.mergedUsers.success = false;
        state.mergedUsers.error = action.payload;
        state.mergedUsers.users = null;
      });
  },
});

export const getUser = createAsyncThunk(
  "Users/GetUser",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`${baseURL}Users/GetUserById`, {
        params: {
          id: userId,
        },
      });

      //console.log(res);
      return res?.data?.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.data) {
        throw rejectWithValue(err.response.data);
      }
      throw rejectWithValue({ message_TR: err.message });
    }
  }
);

export const getMergedUsers = createAsyncThunk(
  "Users/GetMergedUsers",
  async (data, { rejectWithValue }) => {
    try {
      const uniqueUserIds = [...new Set(data.map((user) => user.userId))];

      const userPromises = uniqueUserIds.map((userId) =>
        api
          .get(`${baseURL}Users/GetUserById`, {
            params: {
              userId,
            },
          })
          .then((response) => response.data.data)
      );

      const users = await Promise.all(userPromises);

      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      const updatedData = data.map((entity) => {
        const user = userMap[entity.userId];
        return {
          ...entity,
          email: user.email,
          userName: user.fullName ? user.fullName : "Unknown User",
          isDealer: user.isDealer,
        };
      });

      return updatedData;
    } catch (err) {
      console.error(err);
      if (err?.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message_TR: err.message });
    }
  }
);

export const { resetgetUserState, resetgetUser, resetGetMergedUsers } =
  getUserByIdSlice.actions;
export default getUserByIdSlice.reducer;
