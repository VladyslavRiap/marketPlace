import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchFavorites,
  removeFromFavorites,
} from "@/redux/slices/favoriteSlice";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useSnackbarContext } from "@/context/SnackBarContext";
import Link from "next/link";
import api from "@/utils/api";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  rating: string;
}

interface FavoritesPageProps {
  initialFavorites: Product[];
}

const FavoritesPage = ({ initialFavorites }: FavoritesPageProps) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();

  const { favorites, loading } = useAppSelector((state) => state.favorite);

  useEffect(() => {
    if (favorites.length === 0) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, favorites.length]);

  const handleRemoveFromFavorites = async (favoriteId: number) => {
    try {
      await dispatch(removeFromFavorites(favoriteId)).unwrap();
      showMessage("Товар удален из избранного", "success");
    } catch (error: any) {
      showMessage(
        "Ошибка при удалении из избранного: " + error.message,
        "error"
      );
    }
  };

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
            <motion.div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full h-48">
                <Link href={`/products/${product.id}`} passHref>
                  <div className="w-full h-full relative">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500">
                        Изображение не доступно
                      </div>
                    )}
                  </div>
                </Link>

                <button
                  onClick={() => handleRemoveFromFavorites(product.id)}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition"
                >
                  <Trash2 className="w-5 h-5 text-red-500 hover:text-white" />
                </button>
              </div>

              <div className="p-5">
                <Link href={`/products/${product.id}`} passHref>
                  <h2 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-indigo-600 text-xl font-bold">
                    ${product.price}
                  </span>
                </div>
              </div>
            </motion.div>
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
