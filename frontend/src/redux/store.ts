import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "@/redux/slices/productsSlice";
import authReducer from "@/redux/slices/authSlice";
import favoriteReducer from "@/redux/slices/favoriteSlice";
import cartReducer from "@/redux/slices/cartSlice";
import categoryReducer from "@/redux/slices/categorySlice";
import reviewReducer from "@/redux/slices/reviewSlice";
import adminReducer from "@/redux/slices/adminSlice";
import notificationsReducer from "@/redux/slices/notificationsSlice";
import ordersReducer from "@/redux/slices/orderSlice";
export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    favorite: favoriteReducer,
    cart: cartReducer,
    categories: categoryReducer,
    reviews: reviewReducer,
    admin: adminReducer,
    notifications: notificationsReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
