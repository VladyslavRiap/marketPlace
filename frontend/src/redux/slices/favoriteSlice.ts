import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
}

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
        error.response?.data?.error || "Ошибка загрузки избранного"
      );
    }
  }
);

export const addToFavorites = createAsyncThunk(
  "favorite/addToFavorites",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await api.post("/favorites", { productId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Ошибка добавления в избранное"
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
        error.response?.data?.error || "Ошибка удаления из избранного"
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
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
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
