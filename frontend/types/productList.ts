import { Product } from "./product";

export interface ProductListProps {
  products: Product[];
  status: "loading" | "idle" | "succeeded" | "failed";
  totalPages: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  cardSize?: "small" | "medium" | "large";
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  isInCart?: (productId: number) => boolean;
  isFavorite?: (productId: number) => boolean;
}
