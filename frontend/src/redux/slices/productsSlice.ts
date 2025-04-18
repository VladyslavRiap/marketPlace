import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { Product } from "../../../types/product";

export interface ProductAttribute {
  attribute_id: number;
  attribute_name: string;
  attribute_value: string;
}

interface ProductsState {
  items: Product[];
  sellerItems: Product[];
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  sellerStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  attributes: { id: number; name: string; type: string }[];
  colors: { id: number; name: string; hex_code: string }[];
  sizes: { id: number; name: string }[];
}
interface SearchProductsParams {
  query: string;
  page: number;
  limit: number;
  sortBy?: string;
  order?: string;
}
const initialState: ProductsState = {
  items: [],
  sellerItems: [],
  totalPages: 1,
  status: "idle",
  sellerStatus: "idle",
  error: null,
  attributes: [],
  colors: [],
  sizes: [],
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products", { params });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error loading products");
    }
  }
);

export const resetStatus = createAction("products/resetStatus");
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async ({ query, page, limit, sortBy, order }: SearchProductsParams) => {
    const response = await api.get("/products/search", {
      params: { query, page, limit, sortBy, order },
    });
    return response.data;
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
        error.response?.data || "Error getting seller's products"
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
      return rejectWithValue(error.response?.data || "Error adding product");
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
      return rejectWithValue(error.response?.data || "Error updating product");
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
      return rejectWithValue(error.response?.data || "Error deleting product");
    }
  }
);
export const fetchAttributes = createAsyncThunk(
  "products/fetchAttributes",
  async (subcategoryId: number, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/products/subcategories/${subcategoryId}/attributes`
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Error loading attributes"
      );
    }
  }
);
export const addProductAttributes = createAsyncThunk(
  "products/addProductAttributes",
  async (
    { productId, attributes }: { productId: number; attributes: any[] },
    { rejectWithValue }
  ) => {
    try {
      await api.post(`/products/${productId}/attributes`, { attributes });
      return { productId, attributes };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error adding attributes");
    }
  }
);
export const fetchProductForEdit = createAsyncThunk(
  "products/fetchProductForEdit",
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Error loading product for editing"
      );
    }
  }
);
export const fetchColors = createAsyncThunk(
  "products/fetchColors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products/colors");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error loading colors");
    }
  }
);

export const fetchSizes = createAsyncThunk(
  "products/fetchSizes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products/sizes");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error loading sizes");
    }
  }
);

export const addProductColors = createAsyncThunk(
  "products/addProductColors",
  async (
    { productId, colors }: { productId: number; colors: number[] },
    { rejectWithValue }
  ) => {
    try {
      await api.post(`/products/${productId}/colors`, { colors });
      return { productId, colors };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error adding colors");
    }
  }
);

export const addProductSizes = createAsyncThunk(
  "products/addProductSizes",
  async (
    { productId, sizes }: { productId: number; sizes: number[] },
    { rejectWithValue }
  ) => {
    try {
      await api.post(`/products/${productId}/sizes`, { sizes });
      return { productId, sizes };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error adding sizes");
    }
  }
);
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetAttributes: (state) => {
      state.attributes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.totalPages = action.payload.totalPages;
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
        console.log(action.payload);
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
      })

      .addCase(addProductAttributes.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(addProductAttributes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchAttributes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAttributes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.attributes = action.payload;
      })
      .addCase(fetchAttributes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchProductForEdit.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductForEdit.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(fetchProductForEdit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchColors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.colors = action.payload;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(fetchSizes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSizes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sizes = action.payload;
      })
      .addCase(fetchSizes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(addProductColors.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(addProductColors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(addProductSizes.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(addProductSizes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});
export const { resetAttributes } = productsSlice.actions;
export default productsSlice.reducer;
