import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  user_id: number;
  rating: string;
}

interface ProductsState {
  items: Product[];
  sellerItems: Product[];
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  sellerStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  sellerItems: [],
  totalPages: 1,
  status: "idle",
  sellerStatus: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products", { params });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка при загрузке товаров"
      );
    }
  }
);

export const resetStatus = createAction("products/resetStatus");
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (
    { query, page, limit }: { query: string; page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get("/products/search", {
        params: { query, page, limit },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка при поиске товаров"
      );
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  "products/fetchSellerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products/mine");
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка при получении товаров продавца"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/products", product);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка при добавлении товара"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    { id, product }: { id: number; product: FormData },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.put(`/products/${id}`, product, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка при обновлении товара"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка при удалении товара"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(searchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(fetchSellerProducts.pending, (state) => {
        state.sellerStatus = "loading";
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.sellerStatus = "succeeded";
        state.sellerItems = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.sellerStatus = "failed";
        state.error = action.payload as string;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.sellerItems.push(action.payload);
        state.sellerStatus = "succeeded";
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.sellerItems.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.sellerItems[index] = action.payload;
        }
        state.sellerStatus = "succeeded";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.sellerItems = state.sellerItems.filter(
          (p) => p.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(resetStatus, (state) => {
        state.sellerStatus = "idle";
      });
  },
});

export default productsSlice.reducer;
