import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSnackbarContext } from "@/context/SnackBarContext";
import {
  addToFavorites,
  removeFromFavorites,
  fetchFavorites,
} from "@/redux/slices/favoriteSlice";
import { addToCart, fetchCart } from "@/redux/slices/cartSlice";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image_url: string;
  images: string[];
  rating: string;
}

interface ProductCardProps {
  product: Product;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const favoriteList = useAppSelector((state) => state.favorite.favorites);
  const cartItems = useAppSelector((state) => state.cart.items);

  const [isInCart, setIsInCart] = useState<boolean>(
    cartItems.some((item) => item.id === product.id)
  );
  const isFavorite = favoriteList.some((fav) => fav.id === product.id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsInCart(cartItems.some((item) => item.id === product.id));
  }, [cartItems, product.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovered && product.images && product.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % product.images.length
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, product.images]);

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

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      if (!isInCart) {
        await dispatch(addToCart(product.id)).unwrap();
        showMessage("Товар добавлен в корзину", "success");

        dispatch(fetchCart());
      } else {
        showMessage("Товар уже в корзине", "info");
      }
    } catch (error: any) {
      showMessage("Ошибка при добавлении в корзину: " + error.message, "error");
    }
  };

  return (
    <motion.div
      key={product.id}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-56">
        <Link href={`/products/${product.id}`} passHref>
          <div className="w-full h-full relative">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[currentImageIndex]}
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

        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-black" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}

        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? "text-red-500" : "text-gray-400"
            }`}
          />
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
          <div>
            {product.oldPrice && (
              <span className="text-gray-500 line-through text-sm">
                ${product.oldPrice}
              </span>
            )}
            <span className="text-indigo-600 text-xl font-bold ml-2">
              ${product.price}
            </span>
          </div>
          <p className="text-yellow-500 text-lg flex items-center gap-1">
            <Star className="w-5 h-5" /> {product.rating || 0} / 5
          </p>
        </div>

        <div className="mt-6 flex justify-between items-center">
          {!onEdit && !onDelete && (
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 px-6 rounded-lg flex items-center justify-center transition ${
                isInCart
                  ? "bg-gray-400 text-white "
                  : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600"
              }`}
              disabled={isInCart}
            >
              {isInCart ? (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" /> Товар в корзине
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" /> Добавить в корзину
                </>
              )}
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(product.id)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm md:text-base transition"
            >
              Редактировать
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm md:text-base transition"
            >
              Удалить
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
