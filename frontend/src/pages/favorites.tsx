import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchFavorites } from "@/redux/slices/favoriteSlice";
import { motion } from "framer-motion";

import api from "@/utils/api";
import ProductCard from "@/components/ui/cards/ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  images: string[];
  rating: string;
}

interface FavoritesPageProps {
  initialFavorites: Product[];
}

const FavoritesPage = ({ initialFavorites }: FavoritesPageProps) => {
  const dispatch = useAppDispatch();

  const { favorites, loading } = useAppSelector((state) => state.favorite);

  useEffect(() => {
    if (favorites.length === 0) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, favorites.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">
        Избранные товары
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          У вас пока нет избранных товаров.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data } = await api.get("/favorites", {
      headers: { cookie: req.headers.cookie || "" },
    });

    return {
      props: {
        initialFavorites: data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default FavoritesPage;
