const pool = require("../config/db");
const queries = require("../queries/favorite.queries");

class FavoriteService {
  static async getProduct(productId) {
    const result = await pool.query(queries.GET_PRODUCT_ID, [productId]);
    return result.rows[0];
  }

  static async getFavorite(userId, productId) {
    const result = await pool.query(queries.GET_userID_productId, [
      userId,
      productId,
    ]);
    return result.rows[0];
  }

  static async addToFavorites(userId, productId) {
    const result = await pool.query(queries.ADD_TO_FAVORITE, [
      userId,
      productId,
    ]);
    return result.rows[0];
  }

  static async getFavorites(userId) {
    const result = await pool.query(queries.GET_FAVORITE_LIST, [userId]);
    return result.rows;
  }

  static async getFavoriteById(id, userId) {
    const result = await pool.query(queries.GET_FROM_FAVORITE, [id, userId]);
    return result.rows[0];
  }

  static async removeFromFavorites(id, userId) {
    await pool.query(queries.DELETE_FROM_FAVORITE, [id, userId]);
  }
}

module.exports = FavoriteService;
