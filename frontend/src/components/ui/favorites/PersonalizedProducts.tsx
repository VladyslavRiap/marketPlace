import React, { useRef } from "react";

import ProductCard from "../cards/ProductCard";
import Button from "@/components/Button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/redux/slices/favoriteSlice";
import { Product } from "../../../../types/product";

interface PersonalizedProductsProps {
  initialProducts: Product[];
}

const PersonalizedProducts = ({
  initialProducts,
}: PersonalizedProductsProps) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { favorites } = useAppSelector((state) => state.favorite);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await dispatch(addToCart(product.id)).unwrap();
      showMessage("Product added to cart", "success");
    } catch (error) {
      showMessage("Failed to add to cart", "error");
    }
  };

  const handleToggleFavorite = async (product: Product) => {
    const isFavorite = favorites.some((fav) => fav.id === product.id);
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(product.id)).unwrap();
        showMessage("Product removed from favorites", "info");
      } else {
        await dispatch(addToFavorites(product.id)).unwrap();
        showMessage("Product added to favorites", "success");
      }
    } catch (error) {
      showMessage("An error occurred", "error");
    }
  };

  const isInCart = (productId: number) => {
    return cartItems.some((item) => item.id === productId);
  };

  const isFavorite = (productId: number) => {
    return favorites.some((fav) => fav.id === productId);
  };

  if (!initialProducts || initialProducts.length === 0) {
    return null;
  }

  return (
    <div className=" py-4 lg:px-0 px-4 bg-gray-50 relative">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-12 bg-[#DB4444] rounded"></div>
              <span className="text-black  text-xl">Just for you</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                aria-label="Scroll left"
              >
                <ChevronLeft className="hidden lg:flex w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={scrollRight}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                aria-label="Scroll right"
              >
                <ChevronRight className="hidden lg:flex w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 no-scrollbar scrollbar-hide"
          >
            <div className="flex gap-6 w-max lg:w-auto">
              {initialProducts.map((product) => (
                <div key={product.id} className="w-[280px] flex-shrink-0">
                  <div className="group relative">
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                      onToggleFavorite={() => handleToggleFavorite(product)}
                      isInCart={isInCart(product.id)}
                      isFavorite={isFavorite(product.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center pt-4">
          <Link href="/products" passHref>
            <Button variant="secondary" size="lg" className="rounded-lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedProducts;
