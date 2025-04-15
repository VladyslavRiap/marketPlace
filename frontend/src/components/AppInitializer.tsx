import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchUser } from "@/redux/slices/authSlice";
import { fetchFavorites } from "@/redux/slices/favoriteSlice";
import { fetchCart } from "@/redux/slices/cartSlice";
import { fetchUnreadCount } from "@/redux/slices/notificationsSlice";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchFavorites());
    dispatch(fetchCart());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;
