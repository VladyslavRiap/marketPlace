import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { Product } from "../../../types/product";

interface FavoriteState {
  favorites: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favorites: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  "favorite/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/favorites");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error loading favorites"
      );
    }
  }
);

export const addToFavorites = createAsyncThunk(
  "favorite/addToFavorites",
  async (productId: number, { rejectWithValue }) => {
    try {
      const addResponse = await api.post("/favorites", { productId });

      const productResponse = await api.get(`/products/${productId}`);

      return productResponse.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error add favorites"
      );
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "favorite/removeFromFavorites",
  async (favoriteId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      return favoriteId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error deleted from favorites"
      );
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
        console.log(action.payload);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        const newProduct = action.payload;
        if (!state.favorites.some((item) => item.id === newProduct.id)) {
          state.favorites = [...state.favorites, newProduct];
        }
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
