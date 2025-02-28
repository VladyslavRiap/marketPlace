import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchUser } from "@/redux/slices/authSlice";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;
