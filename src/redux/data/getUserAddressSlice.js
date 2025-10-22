import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const reverse = import.meta.env.VITE_LAT_TO_GEO_API;

const initialState = {
  loading: false,
  success: false,
  error: false,
  address: null,
};

const getUserAddressSlice = createSlice({
  name: "getUserAddress",
  initialState: initialState,
  reducers: {
    resetGetUserAddress: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.address = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getUserAddress.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.address = null;
      })
      .addCase(getUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.address = action.payload;
      })
      .addCase(getUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.address = null;
      });
  },
});

export const getUserAddress = createAsyncThunk(
  "Data/getUserAddress",
  async (_, { rejectWithValue }) => {
    try {
      if (!navigator.geolocation) {
        return rejectWithValue({
          message: "Konum servisi bu tarayıcıda desteklenmiyor.",
        });
      }

      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const { latitude, longitude } = position.coords;

      const response = await axios.get(`${reverse}/reverse`, {
        params: { lat: latitude, lon: longitude, format: "json" },
      });

      const data = response.data;

      if (data?.display_name) {
        return {
          city: data.address.province.toLocaleUpperCase("tr-TR") || "",
          district: data.address.town.toLocaleUpperCase("tr-TR") || "",
          neighbourhood: data.address.suburb.toLocaleUpperCase("tr-TR") || "",
          lat: data.lat,
          lng: data.lon,
          address: data.display_name,
          data,
        };
      } else {
        return rejectWithValue({ message: "Adres bilgisi alınamadı." });
      }
    } catch (err) {
      if (err?.code === 1) {
        rejectWithValue({
          message:
            "Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.",
        });
      } else if (err?.code === 2) {
        rejectWithValue({ message: "Konum bilgisi alınamadı." });
      } else if (err?.code === 3) {
        rejectWithValue({ message: "Konum isteği zaman aşımına uğradı." });
      } else {
        rejectWithValue({ message: err?.message });
      }
    }
  }
);

export const { resetGetUserAddress } = getUserAddressSlice.actions;
export default getUserAddressSlice.reducer;
