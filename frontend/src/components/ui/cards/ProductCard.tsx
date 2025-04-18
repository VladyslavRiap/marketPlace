import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Edit, Trash2, Star } from "lucide-react";
import { Product } from "../../../../types/product";
import Button from "@/components/Button";
import { useAppSelector } from "@/redux/hooks";

interface ProductCardProps {
  product: Product;
  size?: "small" | "medium" | "large";
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isInCart?: boolean;
  isFavorite?: boolean;
  customFavoriteIcon?: React.ReactNode;
  showAddToCart?: boolean;
  userRole?: string | null;
}

const ProductCard = ({
  product,
  size = "medium",
  onAddToCart,
  onToggleFavorite,
  onEdit,
  onDelete,
  isInCart = false,
  isFavorite = false,
  customFavoriteIcon,
  showAddToCart = false,
  userRole,
}: ProductCardProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const hideCartFunctionality = user?.role === "seller" || userRole === null;

  const sizeClasses = {
    small: {
      container: "h-full flex flex-col",
      image: "aspect-square h-40",
      content: "p-2 flex-grow flex flex-col",
      title: "text-sm line-clamp-2 ",
      price: "text-base",
      oldPrice: "text-xs",
      button: "py-1 px-2 text-xs",
      actionButton: "p-1 text-xs",
      discountBadge: "text-xs px-2 py-0.5",
    },
    medium: {
      container: "h-full flex flex-col",
      content: "p-3 flex-grow flex flex-col",
      title: "text-md line-clamp-2 ",
      price: "text-lg",
      oldPrice: "text-sm",
      image: "aspect-square lg:h-64 h-40",
      button: "py-1.5 px-3 text-sm",
      actionButton: "p-1.5 text-sm",
      discountBadge: "text-sm px-2 py-1",
    },
    large: {
      container: "h-full flex flex-col",
      image: "aspect-[4/3] h-80",
      content: "p-4 flex-grow flex flex-col",
      title: "text-lg line-clamp-2 ",
      price: "text-xl",
      oldPrice: "text-base",
      button: "py-2 px-4 text-md",
      actionButton: "p-2 text-md",
      discountBadge: "text-md px-3 py-1",
    },
  };

  return (
    <motion.div
      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${sizeClasses[size].container}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className={`relative ${sizeClasses[size].image} group`}>
        {(product.discount_percent || product.old_price) && (
          <div className="absolute top-0 left-0 z-10">
            <span
              className={`bg-red-500 text-white font-bold rounded-md ${sizeClasses[size].discountBadge}`}
            >
              {product.discount_percent
                ? `-${product.discount_percent}%`
                : product.old_price
                ? "Sale"
                : ""}
            </span>
          </div>
        )}

        <Link href={`/products/${product.id}`} passHref>
          <div className="w-full h-full relative">
            <Image
              src={product.images?.[0] || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300"
            />
          </div>
        </Link>

        {onAddToCart && !hideCartFunctionality && (
          <div className="absolute -bottom-1 lg:bottom-0 left-0 right-0 bg-white/90 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant={isInCart ? "secondary" : "primary"}
              size="sm"
              onClick={onAddToCart}
              disabled={isInCart}
              className={`w-full ${sizeClasses[size].button} ${
                isInCart ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {isInCart ? "Inside cart" : "Add to cart"}
            </Button>
          </div>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className={`p-1.5 rounded-full bg-white/80 shadow`}
              aria-label="Remove from favorites"
            >
              {customFavoriteIcon || (
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite
                      ? "text-red-500 fill-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                />
              )}
            </Button>
          )}

          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(product.id)}
                  className="p-1.5 rounded-full bg-white/80 shadow"
                  aria-label="Edit product"
                >
                  <Edit className="w-4 h-4 text-gray-600 hover:text-blue-500" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(product.id)}
                  className="p-1.5 rounded-full bg-white/80 shadow"
                  aria-label="Delete product"
                >
                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={sizeClasses[size].content}>
        <Link href={`/products/${product.id}`} passHref>
          <h3
            className={`flex items-center font-medium text-gray-900  hover:text-[#DB4444] ${sizeClasses[size].title}`}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-1">
          <span className={`font-bold text-red-500 ${sizeClasses[size].price}`}>
            ${product.price}
          </span>
          {product.old_price && (
            <span
              className={`text-gray-500 line-through ${sizeClasses[size].oldPrice}`}
            >
              ${product.old_price}
            </span>
          )}
        </div>

        <div className="flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(Number(product.rating || 0))
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.rating || 0})
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
