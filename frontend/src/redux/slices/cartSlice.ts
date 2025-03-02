import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  image_url: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Ошибка при загрузке корзины"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await api.post("/cart", { productId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Ошибка при добавлении в корзину"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/${productId}`);

      return productId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Ошибка при удалении товара из корзины"
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async (
    {
      productId,
      quantityChange,
    }: { productId: number; quantityChange: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/cart/update", {
        productId,
        quantityChange,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Ошибка при обновлении количества товара"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/cart/clear");
      return [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Ошибка при очистке корзины"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartRedux: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.loading = false;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.totalAmount += action.payload.total_price;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const item = state.items.find((item) => item.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
          item.total_price = action.payload.total_price;
          state.totalAmount = state.items.reduce(
            (sum, item) => sum + item.total_price,
            0
          );
        }
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
      });
  },
});
export const { clearCartRedux } = cartSlice.actions;
export default cartSlice.reducer;
