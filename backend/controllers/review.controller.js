const pool = require("../config/db");
const queries = require("../queries/review.queries");
class ReviewController {
  static async addReview(req, res) {
    const { userId } = req.user;
    const { productId, rating, comment } = req.body;

    if (!productId || rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 0 and 5" });
    }

    try {
      const productExists = await pool.query(queries.GET_REVIEW_ID[productId]);

      if (productExists.rows.length === 0) {
        return res.status(400).json({ error: "Product not found" });
      }

      await pool.query(queries.INSERT_REVIEW, [
        userId,
        productId,
        rating,
        comment,
      ]);
      await pool.query(queries.UPDATE_PRODUCT_RATING, [productId]);

      res.status(201).json({ message: "Review added and rating updated" });
    } catch (error) {
      console.error("Error adding review:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getProductReviews(req, res) {
    const { id: productId } = req.params;

    try {
      const result = await pool.query(queries.GET_REVIEWS_BY_PRODUCT, [
        productId,
      ]);

      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async updateReview(req, res) {
    const { userId, role } = req.user;
    const { id: reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating && !comment) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    try {
      const reviewResult = await pool.query(queries.GET_REVIEW_BY_ID, [
        reviewId,
      ]);

      if (reviewResult.rows.length === 0) {
        return res.status(404).json({ error: "Review not found" });
      }

      const reviewUserId = reviewResult.rows[0].user_id;

      if (reviewUserId !== userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this review" });
      }

      const result = await pool.query(queries.UPDATE_REVIEW, [
        rating,
        comment,
        reviewId,
      ]);

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating review:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async deleteReview(req, res) {
    const { userId, role } = req.user;
    const { id: reviewId } = req.params;

    try {
      const reviewResult = await pool.query(queries.GET_REVIEW_BY_ID, [
        reviewId,
      ]);

      if (reviewResult.rows.length === 0) {
        return res.status(404).json({ error: "Review not found" });
      }

      const reviewUserId = reviewResult.rows[0].user_id;

      if (reviewUserId !== userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this review" });
      }

      await pool.query(queries.DELETE_REVIEW, [reviewId]);

      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = ReviewController;
