import { createSlice } from "@reduxjs/toolkit";
import { clearTokens, setTokens } from "utils/utils";

const initialState = {
  mode: "light",
  isCartOpen: false,
  user: null,
  token: null,
  cart: [],
  items: [],
  access_token: null,
  refresh_token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action)=> {
      state.user = action.payload;
    },
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setIsCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setLogin: (state, action) => {
      debugger;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      setTokens(action.payload.access_token, action.payload.refresh_token);
    },
    setLogout: (state) => {
      state.access_token = null;
      state.refresh_token = null;
      state.user = null;
      clearTokens();
    },
    setCheckOut: (state) => {
      state.cart = [];
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setItem: (state, action) => {
      state.items.push(action.payload);
    },
    addToCart: (state, action) => {
      const existingCartItem = state.cart.find((cartItem) => cartItem._id === action.payload.item._id);
      if (existingCartItem) {
        const newCart = state.cart.map((cartItem) =>
          cartItem._id === action.payload.item._id ? { ...cartItem, count: Math.min(cartItem.count + action.payload.item.count, cartItem.quantity) } : cartItem
        );
        state.cart = newCart;
      } else {
        state.cart.push(action.payload.item);
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload._id);
    },
    removeManyFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => !action.payload.includes(item._id));
    },
    increaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item._id === action.payload._id) {
          item.count++;
        }
        return item;
      });
    },
    decreaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item._id === action.payload._id && item.count > 1) {
          item.count--;
        }
        return item;
      });
    },
  },
});

export const {
  setUser,
  setMode,
  setLogin,
  setLogout,
  setItems,
  setProducts,
  setItem,
  addToCart,
  removeFromCart,
  increaseCount,
  decreaseCount,
  setIsCartOpen,
  setCheckOut,
  removeManyFromCart,
} = authSlice.actions;

export default authSlice.reducer;
