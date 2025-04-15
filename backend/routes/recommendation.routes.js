const express = require("express");
const router = express.Router();
const RecommendationController = require("../controllers/recommendation.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/track-category/:categoryId",
  authMiddleware,
  RecommendationController.trackCategoryView
);

router.get(
  "/personalized-products",
  authMiddleware,
  RecommendationController.getPersonalizedProducts
);

router.get(
  "/user-categories",
  authMiddleware,
  RecommendationController.getPopularCategoriesForUser
);

module.exports = router;
