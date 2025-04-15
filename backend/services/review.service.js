const pool = require("../config/db");
const queries = require("../queries/review.queries");
const ERROR_MESSAGES = require("../constants/messageErrors");

class ReviewService {
  static async checkProductExists(productId) {
    const result = await pool.query(queries.GET_REVIEW_ID, [productId]);
    return result.rows.length > 0;
  }

  static async addReview(userId, productId, rating, comment) {
    await pool.query(queries.INSERT_REVIEW, [
      userId,
      productId,
      rating,
      comment,
    ]);
    await pool.query(queries.UPDATE_PRODUCT_RATING, [productId]);
  }

  static async getProductReviews(productId) {
    const result = await pool.query(queries.GET_REVIEWS_BY_PRODUCT, [
      productId,
    ]);
    return result.rows;
  }

  static async getReviewById(reviewId) {
    const result = await pool.query(queries.GET_REVIEW_BY_ID, [reviewId]);
    return result.rows[0];
  }

  static async updateReview(reviewId, rating, comment) {
    const result = await pool.query(queries.UPDATE_REVIEW, [
      rating,
      comment,
      reviewId,
    ]);
    return result.rows[0];
  }

  static async deleteReview(reviewId) {
    await pool.query(queries.DELETE_REVIEW, [reviewId]);
  }
}

module.exports = ReviewService;
