// Dedicated slice for TV menu theme saves.
//
// Previously the TV theme selector dispatched the same `setRestaurantTheme`
// thunk used by the QR theme selector — with `{ tvMenuId, restaurantId }`
// instead of `{ themeId, restaurantId }`. The single backend endpoint
// (`Restaurants/UpdateRestaurantTheme`) reads `themeId`; when only
// `tvMenuId` is in the body the missing `themeId` was being defaulted /
// nulled by the backend, which silently overwrote the saved QR theme.
// Symptom: picking a TV theme caused the QR theme to switch to a different
// (often default) one.
//
// Splitting the action type lets the patcher target the correct cached
// field per call and lets the backend route TV updates to a dedicated
// endpoint that only touches `tvMenuId`. The endpoint URL below is the
// agreed name with the backend team — update if they choose a different
// name.

import { createApiSlice } from "../createApiSlice";

const slice = createApiSlice({
  name: "setRestaurantTvTheme",
  thunkType: "Restaurants/SetRestaurantTvTheme",
  // TV-specific endpoint. The backend must implement this as a sibling
  // of UpdateRestaurantTheme that only writes `tvMenuId` and leaves
  // `themeId` untouched. If the project chose a different URL,
  // change it here — keep `thunkType` stable so the patcher matches.
  url: "Restaurants/UpdateRestaurantTvTheme",
  method: "put",
  errorIdle: null,
  clearOnPending: true,
});

export const setRestaurantTvTheme = slice.thunk;
export const { resetSetRestaurantTvTheme } = slice.actions;
export default slice.reducer;
