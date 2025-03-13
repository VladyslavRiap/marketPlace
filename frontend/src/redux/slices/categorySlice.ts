import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

export interface Category {
  id: number;
  name: string;
}

interface CategoriesState {
  categories: Category[];
  subcategories: { [key: number]: Category[] };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  subcategories: {},
  status: "idle",
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products/categories");
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка при загрузке категорий"
      );
    }
  }
);

export const fetchSubcategories = createAsyncThunk(
  "categories/fetchSubcategories",
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/products/categories/${categoryId}/subcategories`
      );
      return { categoryId, subcategories: data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка при загрузке подкатегорий"
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategories[action.payload.categoryId] =
          action.payload.subcategories;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default categoriesSlice.reducer;
