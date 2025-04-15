import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/api";

import { RootState } from "../store";
import { Review } from "../../../types/prod";

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId: number, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${productId}/reviews`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (
    {
      productId,
      rating,
      comment,
    }: { productId: number; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post("/reviews", {
        productId,
        rating,
        comment,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async (
    {
      reviewId,
      rating,
      comment,
    }: { reviewId: number; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.put(`/reviews/${reviewId}`, {
        rating,
        comment,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const updatedReview = action.payload;
        state.reviews = state.reviews.map((review: any) =>
          review.id === updatedReview.id ? updatedReview : review
        );
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectReviews = (state: RootState) => state.reviews.reviews;
export const selectReviewLoading = (state: RootState) => state.reviews.loading;
export const selectReviewError = (state: RootState) => state.reviews.error;

export default reviewSlice.reducer;
