import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const pentURL = import.meta.env.VITE_PENTEGRASYON_API;

const initialState = {
  loading: false,
  success: false,
  error: false,
  neighs: null,
};

const getNeighsSlice = createSlice({
  name: "getNeighs",
  initialState: initialState,
  reducers: {
    resetGetNeighsState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetNeighs: (state) => {
      state.neighs = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getNeighs.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.neighs = null;
      })
      .addCase(getNeighs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.neighs = action.payload;
      })
      .addCase(getNeighs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error;
        state.neighs = null;
      });
  },
});

export const getNeighs = createAsyncThunk(
  "Data/getNeighs",
  async ({ cityId, districtId }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `${pentURL}CityDistrictNeighbourhood/GetNeighbourhoodsByCityIdAndDistrictId`,
        {
          params: {
            cityId,
            districtId,
          },
        }
      );

      if (res?.data?.data) {
        const sortedData = res.data.data.sort((a, b) =>
          a.name.localeCompare(b.name, "tr")
        );

        const data = sortedData.map((element) => {
          return { value: element.name, label: element.name, id: element.id };
        });

        return data;
      }
      return res.data.data;
    } catch (err) {
      const errorMessage = err.message;
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { resetGetNeighsState, resetGetNeighs } = getNeighsSlice.actions;
export default getNeighsSlice.reducer;
