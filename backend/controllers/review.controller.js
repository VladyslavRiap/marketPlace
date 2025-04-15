const ReviewService = require("../services/review.service");
const ERROR_MESSAGES = require("../constants/messageErrors");

class ReviewController {
  static async addReview(req, res, next) {
    const { userId } = req.user;
    const { productId, rating, comment } = req.body;

    try {
      if (!productId || rating === undefined || rating < 0 || rating > 5) {
        return res.status(400).json({
          error: ERROR_MESSAGES.INVALID_RATING,
        });
      }

      const productExists = await ReviewService.checkProductExists(productId);
      if (!productExists) {
        return res.status(400).json({
          error: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
        });
      }

      await ReviewService.addReview(userId, productId, rating, comment);
      res.status(201).json({
        message: ERROR_MESSAGES.REVIEW_ADDED,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductReviews(req, res, next) {
    const { id: productId } = req.params;

    try {
      const reviews = await ReviewService.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  static async updateReview(req, res, next) {
    const { userId } = req.user;
    const { id: reviewId } = req.params;
    const { rating, comment } = req.body;

    try {
      if (!rating && !comment) {
        return res.status(400).json({
          error: ERROR_MESSAGES.NOTHING_TO_UPDATE,
        });
      }

      const review = await ReviewService.getReviewById(reviewId);
      if (!review) {
        return res.status(404).json({
          error: ERROR_MESSAGES.REVIEW_NOT_FOUND,
        });
      }

      if (review.user_id !== userId) {
        return res.status(403).json({
          error: ERROR_MESSAGES.UNAUTHORIZED_REVIEW_UPDATE,
        });
      }

      const updatedReview = await ReviewService.updateReview(
        reviewId,
        rating,
        comment
      );
      res.json(updatedReview);
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req, res, next) {
    const { userId } = req.user;
    const { id: reviewId } = req.params;

    try {
      const review = await ReviewService.getReviewById(reviewId);
      if (!review) {
        return res.status(404).json({
          error: ERROR_MESSAGES.REVIEW_NOT_FOUND,
        });
      }

      if (review.user_id !== userId) {
        return res.status(403).json({
          error: ERROR_MESSAGES.UNAUTHORIZED_REVIEW_DELETE,
        });
      }

      await ReviewService.deleteReview(reviewId);
      res.json({
        message: ERROR_MESSAGES.REVIEW_DELETED,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReviewController;
