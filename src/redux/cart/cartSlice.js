import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.items.find(
        (i) => i.id === item.id && i.restaurantId === item.restaurantId
      );
      if (!existingItem) {
        state.items.push(item);
      }
    },
    removeItemFromCart: (state, action) => {
      const id = action.payload.id;
      const restaurantId = action.payload.restaurantId;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.restaurantId === restaurantId)
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
