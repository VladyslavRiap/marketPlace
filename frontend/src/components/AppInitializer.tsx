import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchUser } from "@/redux/slices/authSlice";
import { fetchFavorites } from "@/redux/slices/favoriteSlice";
import { fetchCart } from "@/redux/slices/cartSlice";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchFavorites());
    dispatch(fetchCart());
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;
