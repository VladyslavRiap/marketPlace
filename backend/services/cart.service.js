const pool = require("../config/db");
const queries = require("../queries/cart.queries");
const ERROR_MESSAGES = require("../constants/messageErrors");

class CartService {
  static async addToCart(userId, productId, quantity) {
    const result = await pool.query(queries.ADD_TO_CART, [
      userId,
      productId,
      quantity,
    ]);
    return result.rows[0];
  }

  static async removeFromCart(userId, productId) {
    await pool.query(queries.DELETE_FROM_CART, [userId, productId]);
  }

  static async getCart(userId) {
    const result = await pool.query(queries.GET_CART, [userId]);
    return result.rows;
  }

  static async findCartItem(userId, productId) {
    const result = await pool.query(queries.FIND_CART, [userId, productId]);
    return result.rows[0];
  }

  static async updateQuantity(userId, productId, quantityChange) {
    const result = await pool.query(queries.UPDATE_QUANTITY, [
      quantityChange,
      userId,
      productId,
    ]);
    return result.rows[0];
  }

  static async clearCart(userId) {
    await pool.query(queries.DELETE_FULL_CART, [userId]);
  }
}

module.exports = CartService;
