import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
  return (
    <Link href={`/products/${product.id}`} passHref>
      <motion.div
        key={product.id}
        className="bg-white shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-green-500/30 transition-shadow duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full h-48">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            // Временно
            <div className="w-full h-full bg-gray-300">
              Изображение не доступно
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {product.name}
          </h2>
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
    </Link>
  );
};

export default ProductCard;
