const pool = require("../config/db");
const queries = require("../queries/favorite.queries");
class FavoriteController {
  static async addToFavorites(req, res) {
    const { userId } = req.user;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    try {
      const product = await pool.query(queries.GET_PRODUCT_ID, [productId]);
      if (product.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const existingFavorite = await pool.query(queries.GET_userID_productId, [
        userId,
        productId,
      ]);

      if (existingFavorite.rows.length > 0) {
        return res.status(400).json({ error: "Product already in favorites" });
      }

      const result = await pool.query(queries.ADD_TO_FAVORITE, [
        userId,
        productId,
      ]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error adding to favorites:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getFavorites(req, res) {
    const { userId } = req.user;

    try {
      const result = await pool.query(queries.GET_FAVORITE_LIST, [userId]);

      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async removeFromFavorites(req, res) {
    const { userId } = req.user;
    const { id } = req.params;

    try {
      const favorite = await pool.query(queries.GET_FROM_FAVORITE, [
        id,
        userId,
      ]);

      if (favorite.rows.length === 0) {
        return res.status(404).json({ error: "Favorite not found" });
      }

      await pool.query(queries.DELETE_FROM_FAVORITE, [id]);

      res.json({ message: "Product removed from favorites" });
    } catch (error) {
      console.error("Error removing from favorites:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = FavoriteController;
