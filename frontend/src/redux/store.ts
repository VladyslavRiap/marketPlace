import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "@/redux/slices/productsSlice";
import authReducer from "@/redux/slices/authSlice";
import favoriteReducer from "@/redux/slices/favoriteSlice";
import cartReducer from "@/redux/slices/cartSlice";
export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    favorite: favoriteReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
