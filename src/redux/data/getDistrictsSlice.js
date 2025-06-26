//https://api.pentegrasyon.net:9007/api/v1/CityDistrictNeighbourhood/GetCities

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const pentURL = import.meta.env.VITE_PENTEGRASYON_API;

const initialState = {
  loading: false,
  success: false,
  error: false,
  districts: null,
};

const getDistrictsSlice = createSlice({
  name: "getDistricts",
  initialState: initialState,
  reducers: {
    resetGetDistrictsState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetDistricts: (state) => {
      state.districts = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getDistricts.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.districts = null;
      })
      .addCase(getDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.districts = action.payload;
      })
      .addCase(getDistricts.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error;
        state.districts = null;
      });
  },
});

export const getDistricts = createAsyncThunk(
  "Data/getDistricts",
  async ({ cityId }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `${pentURL}CityDistrictNeighbourhood/GetDistrictsByCityId`,
        {
          params: {
            cityId,
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

export const { resetGetDistrictsState, resetGetDistricts } =
  getDistrictsSlice.actions;
export default getDistrictsSlice.reducer;
