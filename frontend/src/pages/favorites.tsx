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

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
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
    return <div>Загрузка...</div>;
  }

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Избранные товары</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600">У вас пока нет избранных товаров.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="bg-white shadow-lg rounded-lg p-4">
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-lg font-bold">${product.price}</p>
              </Link>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleRemoveFromFavorites(product.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
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
