const FavoriteService = require("../services/favorite.service");
const ERROR_MESSAGES = require("../constants/messageErrors");

class FavoriteController {
  static async addToFavorites(req, res, next) {
    const { userId } = req.user;
    const { productId } = req.body;

    try {
      if (!productId) {
        return res
          .status(400)
          .json({ error: ERROR_MESSAGES.PRODUCT_ID_REQUIRED });
      }

      const product = await FavoriteService.getProduct(productId);
      if (!product) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
      }

      const existingFavorite = await FavoriteService.getFavorite(
        userId,
        productId
      );
      if (existingFavorite) {
        return res.status(400).json({ error: ERROR_MESSAGES.FAVORITE_EXISTS });
      }

      const favorite = await FavoriteService.addToFavorites(userId, productId);
      res.status(201).json(favorite);
    } catch (error) {
      next(error);
    }
  }

  static async getFavorites(req, res, next) {
    const { userId } = req.user;

    try {
      const favorites = await FavoriteService.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      next(error);
    }
  }

  static async removeFromFavorites(req, res, next) {
    const { userId } = req.user;
    const { id } = req.params;

    try {
      const favorite = await FavoriteService.getFavoriteById(id, userId);
      if (!favorite) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.FAVORITE_NOT_FOUND });
      }

      await FavoriteService.removeFromFavorites(id, userId);
      res.json({ message: ERROR_MESSAGES.FAVORITE_REMOVED });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FavoriteController;
