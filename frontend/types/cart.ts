export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  images: string[];
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

export interface CartPageProps {
  initialCart: CartState;
}

export interface CartItemProps {
  item: CartItem;
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, change: number) => void;
}

export interface CartHeaderProps {
  itemCount: number;
}

export interface CartEmptyProps {}

export interface CartTotalProps {
  totalAmount: number;
  itemCount: number;
}

export interface RemoveFromCartPayload {
  productId: number;
}

export interface UpdateCartQuantityPayload {
  productId: number;
  quantityChange: number;
}

export interface CartApiResponse {
  items: CartItem[];
  totalAmount: number;
  success: boolean;
  message?: string;
}

export interface CartOperations {
  handleRemove: (productId: number) => Promise<void>;
  handleUpdateQuantity: (productId: number, change: number) => Promise<void>;
  handleClearCart: () => Promise<void>;
}

export interface MobileCartHeaderProps {
  title: string;
}

export interface DesktopCartTableHeaderProps {
  columns: {
    title: string;
    span: number;
    align?: "left" | "center" | "right";
  }[];
}
