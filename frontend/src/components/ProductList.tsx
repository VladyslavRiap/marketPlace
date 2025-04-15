import React from "react";
import ProductCard from "@/components/ui/cards/ProductCard";
import { ProductListProps } from "../../types/productList";
import Pagination from "./Pagination";

const ProductList: React.FC<ProductListProps> = ({
  products,
  status,
  totalPages,
  currentPage,
  onPageChange,
  cardSize = "medium",
  onAddToCart,
  onToggleFavorite,
  isInCart,
  isFavorite,
}) => {
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (products.length === 0) {
    return <div>No products found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            size={cardSize}
            onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined}
            onToggleFavorite={
              onToggleFavorite ? () => onToggleFavorite(product) : undefined
            }
            isInCart={isInCart ? isInCart(product.id) : false}
            isFavorite={isFavorite ? isFavorite(product.id) : false}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ProductList;
