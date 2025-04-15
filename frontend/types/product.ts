export interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number;
  description: string;
  image_url: string;
  images: string[];
  rating: number;
  user_id?: number;
  subcategory?: string;
  discount_percent?: number;
  view_count?: number;
  purchase_count?: number;
  attributes?: ProductAttribute[];
  [key: string]: any;
}

export interface ProductAttribute {
  attribute_id?: number;
  attribute_name?: string;
  attribute_value?: string;
}
