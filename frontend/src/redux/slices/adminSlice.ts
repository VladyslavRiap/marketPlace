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
interface Ad {
  id: number;
  image_url: string;
  position?: string;
  title?: string;
  link_url?: string;
  is_active?: boolean;
}

interface AdminState {
  products: Product[];
  users: User[];
  ads: Record<string, Ad[]>;
}

const initialState: AdminState = {
  products: [],
  users: [],
  ads: {},
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

export const fetchAdsByPosition = createAsyncThunk(
  "admin/ads",
  async (position: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/ads?position=${position}`);
      return { position, ads: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addAd = createAsyncThunk(
  "admin/addAd",
  async (
    adData: { image: File; position: string; title: string; linkUrl: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("image", adData.image);
      formData.append("position", adData.position);
      formData.append("title", adData.title);
      formData.append("link_url", adData.linkUrl);

      const response = await api.post("/admin/ads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteAd = createAsyncThunk(
  "admin/deleteAd",
  async (adId: number) => {
    await api.delete(`/admin/ads/${adId}`);
    return adId;
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
      })
      .addCase(fetchAdsByPosition.fulfilled, (state, action) => {
        const { position, ads } = action.payload;
        state.ads[position] = ads;
      })
      .addCase(addAd.fulfilled, (state, action) => {
        const ad = action.payload;
        const position = ad.position;
        if (!position) return;

        if (!state.ads[position]) {
          state.ads[position] = [];
        }
        state.ads[position].push(ad);
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        const adId = action.payload;

        for (const position in state.ads) {
          state.ads[position] = state.ads[position].filter(
            (ad) => ad.id !== adId
          );
        }
      });
  },
});

export default adminSlice.reducer;
