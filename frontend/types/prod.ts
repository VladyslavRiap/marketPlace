import { Product as BaseProduct } from "./product";

export interface ProductAttribute {
  attribute_id: number;
  attribute_name: string;
  attribute_value: string;
}

export interface Product extends BaseProduct {
  attributes: ProductAttribute[];
  category: string;
  category_id: number;
  subcategory: string;
  discount_percent: number;
  rating: number;
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_avatar_url?: string;
}

export interface ProductPageProps {
  product: Product | null;
  reviews: Review[];
  recommendedProducts: BaseProduct[];
}
