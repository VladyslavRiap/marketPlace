import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import api from "@/utils/api";
import Image from "next/image";
import {
  addToFavorites,
  fetchFavorites,
  removeFromFavorites,
} from "@/redux/slices/favoriteSlice";
import { useSnackbarContext } from "@/context/SnackBarContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Star, Heart, ShoppingCart } from "lucide-react";
import getAttributeIcon from "@/utils/iconutils";
import { useState } from "react";

interface ProductAttribute {
  attribute_id: number;
  attribute_name: string;
  attribute_value: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image_url: string;
  images: string[];
  rating: number;
  attributes: ProductAttribute[];
}

interface ProductPageProps {
  product: Product | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const { data } = await api.get(`/products/${id}`);

    return {
      props: { product: data },
    };
  } catch (error) {
    console.error("Ошибка при загрузке продукта:", error);
    return {
      props: { product: null },
    };
  }
};

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const favorites = useAppSelector((state) => state.favorite.favorites);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product?.images?.[0] || null
  );

  const isFavorite = product
    ? favorites.some((fav) => fav.id === product.id)
    : false;

  const handleFavoriteToggle = async () => {
    if (!product) return;
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(product.id)).unwrap();
        showMessage("Товар удален из избранного", "success");
      } else {
        await dispatch(addToFavorites(product.id)).unwrap();
        showMessage("Товар добавлен в избранное", "success");
      }
      dispatch(fetchFavorites());
    } catch (error: any) {
      showMessage("Ошибка при изменении избранного: " + error.message, "error");
    }
  };

  if (!product) {
    return (
      <motion.div
        className="text-center text-red-500 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>Товар не найден</p>
        <motion.button
          onClick={() => router.push("/")}
          className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Вернуться на главную
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg shadow-lg overflow-hidden"
        >
          <Image
            src={selectedImage || product.image_url}
            alt={product.name}
            width={2000}
            height={2000}
            className="w-full h-96 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
          />

          <div className="flex gap-2 mt-4">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer border-2 ${
                  selectedImage === image
                    ? "border-indigo-600"
                    : "border-transparent"
                } rounded-lg overflow-hidden`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-20 h-20 object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <div>
          <motion.h1
            className="text-4xl font-bold text-gray-900"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {product.name}
          </motion.h1>
          <p className="text-yellow-500 text-lg flex items-center gap-2 mt-2">
            <Star className="w-5 h-5" /> {product.rating || 0} / 5
          </p>

          <div className="mt-4">
            {product.oldPrice && (
              <span className="text-gray-500 line-through text-lg">
                ${product.oldPrice}
              </span>
            )}
            <span className="text-indigo-600 text-3xl font-bold ml-2">
              ${product.price}
            </span>
          </div>

          <div className="mt-6 flex gap-4">
            <motion.button
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:from-indigo-700 hover:to-indigo-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="inline-block w-5 h-5 mr-2" />
              Добавить в корзину
            </motion.button>
            <motion.button
              className={`border px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition ${
                isFavorite
                  ? "border-red-600 text-red-600 hover:bg-red-50"
                  : "border-gray-400 text-gray-700 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFavoriteToggle}
            >
              <Heart className="inline-block w-5 h-5 mr-2" />
              {isFavorite ? "Удалить из избранного" : "В избранное"}
            </motion.button>
          </div>
        </div>
      </div>

      {product.attributes && product.attributes.length > 0 && (
        <motion.div
          className="mt-8 bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Атрибуты товара:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.attributes.map((attribute) => (
              <div
                key={attribute.attribute_id}
                className="bg-gray-50 p-4 rounded-lg flex items-center gap-3"
              >
                {getAttributeIcon(attribute.attribute_name)}
                <div>
                  <p className="text-gray-700 font-medium">
                    {attribute.attribute_name}
                  </p>
                  <p className="text-gray-600">{attribute.attribute_value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductPage;
