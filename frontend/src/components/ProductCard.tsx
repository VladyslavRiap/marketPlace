import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSnackbarContext } from "@/context/SnackBarContext";
import {
  addToFavorites,
  removeFromFavorites,
  fetchFavorites,
} from "@/redux/slices/favoriteSlice";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image_url: string;
  rating: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const favoriteList = useAppSelector((state) => state.favorite.favorites);

  const isFavorite = favoriteList.some((fav) => fav.id === product.id);

  const handleFavoriteClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(product.id)).unwrap();
        showMessage("Товар удален из избранного", "info");
      } else {
        await dispatch(addToFavorites(product.id)).unwrap();
        showMessage("Товар добавлен в избранное", "success");
      }

      dispatch(fetchFavorites());
    } catch (error: any) {
      showMessage("Ошибка: " + error.message, "error");
    }
  };

  return (
    <motion.div
      key={product.id}
      className="bg-white shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-green-500/30 transition-shadow duration-300"
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
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700">
                Изображение не доступно
              </div>
            )}
          </div>
        </Link>

        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? "text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <Link href={`/products/${product.id}`} passHref>
          <h2 className="text-xl font-semibold text-gray-800 hover:text-green-600 transition">
            {product.name}
          </h2>
        </Link>
        <p className="text-gray-600 text-sm mt-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div>
            {product.oldPrice && (
              <span className="text-gray-500 line-through text-sm">
                ${product.oldPrice}
              </span>
            )}
            <span className="text-red-600 text-lg font-bold ml-2">
              ${product.price}
            </span>
          </div>
          <span className="text-sm text-yellow-500">⭐ {product.rating}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
