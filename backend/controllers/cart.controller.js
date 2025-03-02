const pool = require("../config/db");
const queries = require("../queries/cart.queries");
class CartController {
  static async addToCart(req, res) {
    const { userId } = req.user;
    const { productId, quantity = 1 } = req.body;

    try {
      const result = await pool.query(queries.ADD_TO_CART, [
        userId,
        productId,
        quantity,
      ]);

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async removeFromCart(req, res) {
    const { userId } = req.user;
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Некорректный ID товара" });
    }

    try {
      await pool.query(queries.DELETE_FROM_CART, [userId, productId]);
      res.json({ message: "Товар удален из корзины" });
    } catch (error) {
      console.error("Ошибка удаления товара из корзины:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  static async getCart(req, res) {
    const { userId } = req.user;

    try {
      const result = await pool.query(queries.GET_CART, [userId]);

      const cartItems = result.rows;
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.total_price),
        0
      );

      res.json({ items: cartItems, totalAmount });
    } catch (error) {
      console.error("Error fetching cart:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async updateQuantityInCart(req, res) {
    const { userId } = req.user;
    const { productId, quantityChange } = req.body;

    if (![1, -1].includes(quantityChange)) {
      return res.status(400).json({ error: "quantityChange must be +1 or -1" });
    }

    try {
      const cartItemResult = await pool.query(queries.FIND_CART, [
        userId,
        productId,
      ]);

      const cartItem = cartItemResult.rows[0];

      if (!cartItem) {
        return res.status(404).json({ error: "Item not found in cart" });
      }

      if (quantityChange === -1 && cartItem.quantity <= 1) {
        return res
          .status(400)
          .json({ error: "Item quantity cannot be less than 1" });
      }

      const updatedCartItem = await pool.query(queries.UPDATE_QUANTITY, [
        quantityChange,
        userId,
        productId,
      ]);

      res.json(updatedCartItem.rows[0]);
    } catch (error) {
      console.error("Error updating item quantity in cart:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async clearCart(req, res) {
    const { userId } = req.user;

    try {
      await pool.query(queries.DELETE_FULL_CART, [userId]);
      res.json({ message: "Cart cleared successfully" });
    } catch (error) {
      console.error("Error clearing cart:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
}
module.exports = CartController;
