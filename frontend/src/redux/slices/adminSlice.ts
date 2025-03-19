import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/api";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  is_blocked: boolean;
  role: string;
}

interface AdminState {
  products: Product[];
  users: User[];
}

const initialState: AdminState = {
  products: [],
  users: [],
};

export const fetchProducts = createAsyncThunk(
  "admin/fetchProducts",
  async () => {
    const response = await api.get("/admin/products");
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId: number) => {
    await api.delete(`/admin/products/${productId}`);
    return productId;
  }
);

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const response = await api.get("/admin/users");
  return response.data;
});

export const blockUser = createAsyncThunk(
  "admin/blockUser",
  async (userId: number) => {
    await api.put(`/admin/users/${userId}/block`);
    return userId;
  }
);

export const unblockUser = createAsyncThunk(
  "admin/unblockUser",
  async (userId: number) => {
    await api.put(`/admin/users/${userId}/unblock`);
    return userId;
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        const user = state.users.find((user) => user.id === action.payload);
        if (user) {
          user.is_blocked = true;
        }
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        const user = state.users.find((user) => user.id === action.payload);
        if (user) {
          user.is_blocked = false;
        }
      });
  },
});

export default adminSlice.reducer;
