import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  status: string;
  images: string[];
  seller_id?: number;
  cancel_reason?: string;
  color_id?: number;
  color_name?: string;
  size_id?: number;
  size_name?: string;
}

export interface Order {
  id: number;
  user_id: number;
  delivery_address: string;
  phone: string;
  first_name: string;
  last_name: string;
  city: string;
  region: string;
  created_at: string;
  estimated_delivery_date: string;
  items: OrderItem[];
  status: string;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userRole: "buyer" | "seller") => {
    const endpoint = userRole === "seller" ? "/orders/seller" : "/orders/buyer";
    const { data } = await api.get(endpoint);
    return Array.isArray(data)
      ? data
      : Array.isArray(data?.orders)
      ? data.orders
      : [];
  }
);
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (orderId: number) => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  }
);
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async (payload: {
    orderId: number;
    productId: number;
    status: string;
    cancelReason?: string;
  }) => {
    await api.put("/orders/status", payload);
    return payload;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const existingIndex = state.orders.findIndex(
            (o) => o.id === action.payload.id
          );
          if (existingIndex >= 0) {
            state.orders[existingIndex] = action.payload;
          } else {
            state.orders.push(action.payload);
          }
        }
      )
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, productId, status, cancelReason } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          const item = order.items.find((i) => i.product_id === productId);
          if (item) {
            item.status = status;
            if (cancelReason) {
              item.cancel_reason = cancelReason;
            }
          }
        }
      });
  },
});

export default ordersSlice.reducer;
