//https://api.pentegrasyon.net:9007/api/v1/CityDistrictNeighbourhood/GetCities

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const pentURL = import.meta.env.VITE_PENTEGRASYON_API;

const initialState = {
  loading: false,
  success: false,
  error: false,
  cities: null,
};

const getCitiesSlice = createSlice({
  name: "getCities",
  initialState: initialState,
  reducers: {
    resetGetCitiesState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetCities: (state) => {
      state.cities = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getCities.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.cities = null;
      })
      .addCase(getCities.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.cities = action.payload;
      })
      .addCase(getCities.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.cities = null;
      });
  },
});

export const getCities = createAsyncThunk(
  "Data/getCities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `${pentURL}CityDistrictNeighbourhood/GetCities`
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

export const { resetGetCitiesState, resetGetCities } = getCitiesSlice.actions;
export default getCitiesSlice.reducer;
