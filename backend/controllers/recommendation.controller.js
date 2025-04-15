const RecommendationService = require("../services/recommendation.service");
const CategoryService = require("../services/category.service");
const ProductService = require("../services/product.service");
const ERROR_MESSAGES = require("../constants/messageErrors");

class RecommendationController {
  static async trackCategoryView(req, res, next) {
    try {
      const { categoryId } = req.params;
      const userId = req.user.userId;

      if (!categoryId) {
        return res
          .status(400)
          .json({ error: ERROR_MESSAGES.CATEGORY_ID_REQUIRED });
      }

      await CategoryService.trackCategoryView(userId, categoryId);
      res.json({ message: "Category view tracked successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async getPersonalizedProducts(req, res, next) {
    try {
      const userId = req.user.userId;
      const { limit = 10 } = req.query;

      const products = await RecommendationService.getPersonalizedProducts(
        userId,
        limit
      );
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getPopularCategoriesForUser(req, res, next) {
    try {
      const userId = req.user.userId;
      const { limit = 3 } = req.query;

      const categoryIds = await CategoryService.getTopCategoriesForUser(
        userId,
        limit
      );
      const categories = await ProductService.getCategories();
      const userCategories = categories.filter((cat) =>
        categoryIds.includes(cat.id.toString())
      );

      res.json(userCategories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RecommendationController;
