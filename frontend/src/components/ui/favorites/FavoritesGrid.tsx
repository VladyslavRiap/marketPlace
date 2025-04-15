// components/ui/favorites/FavoritesGrid.tsx
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchFavorites,
  removeFromFavorites,
} from "@/redux/slices/favoriteSlice";
import { addMultipleToCart, addToCart } from "@/redux/slices/cartSlice";
import ProductCard from "../cards/ProductCard";
import { Trash2, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";

import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { Product } from "../../../../types/product";
import Button from "@/components/Button";

interface FavoritesGridProps {
  initialFavorites: Product[];
}

const FavoritesGrid = ({ initialFavorites }: FavoritesGridProps) => {
  const dispatch = useAppDispatch();
  const { favorites, loading } = useAppSelector((state) => state.favorite);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { showMessage } = useSnackbarContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleAddAllToCart = () => {
    const productIds = favorites.map((product) => product.id);
    dispatch(addMultipleToCart(productIds))
      .unwrap()
      .then(() => {
        showMessage("All items added to cart", "success");
      })
      .catch((err) => {
        showMessage(err || "Error adding items to cart", "error");
      });
  };

  useEffect(() => {
    if (favorites.length === 0 && initialFavorites.length > 0) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, favorites.length, initialFavorites.length]);

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

  const handleRemoveFavorite = (productId: number) => {
    dispatch(removeFromFavorites(productId));
    showMessage("Removed from favorites", "success");
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product.id));
    showMessage("Added to cart", "success");
  };

  const isInCart = (productId: number) => {
    return cartItems.some((item) => item.id === productId);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={<Trash2 className="w-12 h-12 text-gray-300 mx-auto" />}
        title="Your wishlist is empty"
        description="Add items to your wishlist to see them here"
        actionText="Start Shopping"
        actionLink="/"
      />
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Wishlist ({favorites.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={scrollRight}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-4 no-scrollbar scrollbar-hide"
      >
        <div className="flex gap-6 w-max">
          {favorites.map((product: Product) => (
            <div key={product.id} className="w-[280px] flex-shrink-0">
              <ProductCard
                product={product}
                size="medium"
                onToggleFavorite={() => handleRemoveFavorite(product.id)}
                onAddToCart={() => handleAddToCart(product)}
                isInCart={isInCart(product.id)}
                isFavorite={true}
                customFavoriteIcon={
                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500" />
                }
                showAddToCart={true}
              />
            </div>
          ))}
        </div>
        {initialFavorites.length > 0 && (
          <div className="flex justify-center pt-8">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleAddAllToCart}
              className="flex items-center gap-2 border border-gray-400"
            >
              <ShoppingCart className="w-5 h-5" />
              Move all to bag
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesGrid;
