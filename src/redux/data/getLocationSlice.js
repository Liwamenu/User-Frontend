//https://api.pentegrasyon.net:9007/api/v1/CityDistrictNeighbourhood/GetLocation

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  success: false,
  error: false,
  location: null,
};

const getLoationSlice = createSlice({
  name: "getLocation",
  initialState: initialState,
  reducers: {
    resetGetLocationState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetGetLocation: (state) => {
      state.location = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(getLocation.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.location = null;
      })
      .addCase(getLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.location = action.payload;
      })
      .addCase(getLocation.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.location = null;
      });
  },
});

// export const getLocation = createAsyncThunk(
//   "Route/GetLocation",
//   async ({ address }, { rejectWithValue }) => {
//     try {
//       const res = await api.post(
//         `${baseURL}Route/GetLocation`,
//         {},
//         {
//           params: { address },
//         }
//       );

//       console.log(res.data);
//       return res.data.data;
//     } catch (err) {
//       console.log(err);
//       if (err?.response?.data) {
//         throw rejectWithValue(err.response.data);
//       }
//       throw rejectWithValue({ message_TR: err.message });
//     }
//   }
// );

// export const getLocation = createAsyncThunk(
//   "Route/GetLocation",
//   async ({ address }, { rejectWithValue }) => {
//     const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
//     const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//       address
//     )}&key=${apiKey}`;

//     try {
//       const response = await axios.get(geocodeUrl);
//       const data = response.data;

//       if (data.status === "OK") {
//         const result = data.results[0];
//         const viewport = result.geometry.viewport;

//         const minLat = viewport.southwest.lat;
//         const maxLat = viewport.northeast.lat;
//         const minLng = viewport.southwest.lng;
//         const maxLng = viewport.northeast.lng;

//         const location = { minLat, maxLat, minLng, maxLng };
//         console.log(location);
//         return location;
//       } else {
//         throw new Error(`Geocode was not successful: ${data.status}`);
//       }
//     } catch (err) {
//       console.log(err);
//       if (err?.response?.data) {
//         return rejectWithValue(err.response.data);
//       }
//       return rejectWithValue({ message_TR: err.message });
//     }
//   }
// );

export const getLocation = createAsyncThunk(
  "Route/GetLocation",
  async ({ address }, { rejectWithValue }) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(geocodeUrl);
      const data = response.data;

      if (data.status === "OK") {
        const result = data.results[0];
        const bounds = result.geometry.bounds;

        if (bounds) {
          const boundaryCoords = [
            {
              lat: parseFloat(bounds.southwest.lat.toFixed(6)),
              lng: parseFloat(bounds.southwest.lng.toFixed(6)),
            },
            {
              lat: parseFloat(bounds.southwest.lat.toFixed(6)),
              lng: parseFloat(bounds.northeast.lng.toFixed(6)),
            },
            {
              lat: parseFloat(bounds.northeast.lat.toFixed(6)),
              lng: parseFloat(bounds.northeast.lng.toFixed(6)),
            },
            {
              lat: parseFloat(bounds.northeast.lat.toFixed(6)),
              lng: parseFloat(bounds.southwest.lng.toFixed(6)),
            },
          ];

          // console.log(boundaryCoords);
          return boundaryCoords;
        } else {
          // Fallback if bounds are not available
          const viewport = result.geometry.viewport;
          const boundaryCoords = [
            { lat: viewport.southwest.lat, lng: viewport.southwest.lng },
            { lat: viewport.southwest.lat, lng: viewport.northeast.lng },
            { lat: viewport.northeast.lat, lng: viewport.northeast.lng },
            { lat: viewport.northeast.lat, lng: viewport.southwest.lng },
          ];

          // console.log(boundaryCoords);
          return boundaryCoords;
        }
      } else {
        throw new Error(`Geocode was not successful: ${data.status}`);
      }
    } catch (err) {
      console.log(err);
      return rejectWithValue({ message: err.message });
    }
  }
);

export const { resetGetLocationState, resetGetLocation } =
  getLoationSlice.actions;
export default getLoationSlice.reducer;
