export interface ProductColor {
  id: number;
  name: string;
  hex_code?: string;
}

export interface ProductSize {
  id: number;
  name: string;
}

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
  colors?: ProductColor[];
  sizes?: ProductSize[];
  [key: string]: any;
}

export interface ProductAttribute {
  attribute_id?: number;
  attribute_name?: string;
  attribute_value?: string;
}
