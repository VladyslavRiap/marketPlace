const CartService = require("../services/cart.service");
const ERROR_MESSAGES = require("../constants/messageErrors");

class CartController {
  static async addToCart(req, res, next) {
    const { userId } = req.user;
    const { productId, quantity = 1 } = req.body;

    try {
      const cartItem = await CartService.addToCart(userId, productId, quantity);
      res.json(cartItem);
    } catch (error) {
      next(error);
    }
  }

  static async removeFromCart(req, res, next) {
    const { userId } = req.user;
    const productId = parseInt(req.params.id, 10);

    try {
      if (isNaN(productId)) {
        return res.status(400).json({ error: ERROR_MESSAGES.VALIDATION_ERROR });
      }

      await CartService.removeFromCart(userId, productId);
      res.json({ message: ERROR_MESSAGES.CART_ITEM_DELETED });
    } catch (error) {
      next(error);
    }
  }

  static async getCart(req, res, next) {
    const { userId } = req.user;

    try {
      const cartItems = await CartService.getCart(userId);
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.total_price),
        0
      );

      res.json({ items: cartItems, totalAmount });
    } catch (error) {
      next(error);
    }
  }

  static async updateQuantityInCart(req, res, next) {
    const { userId } = req.user;
    const { productId, quantityChange } = req.body;

    try {
      if (![1, -1].includes(quantityChange)) {
        return res.status(400).json({ error: ERROR_MESSAGES.VALIDATION_ERROR });
      }

      const cartItem = await CartService.findCartItem(userId, productId);

      if (!cartItem) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.CART_ITEM_NOT_FOUND });
      }

      if (quantityChange === -1 && cartItem.quantity <= 1) {
        return res.status(400).json({
          error: ERROR_MESSAGES.CART_MIN_QUANTITY,
        });
      }

      const updatedCartItem = await CartService.updateQuantity(
        userId,
        productId,
        quantityChange
      );

      res.json(updatedCartItem);
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req, res, next) {
    const { userId } = req.user;

    try {
      await CartService.clearCart(userId);
      res.json({ message: ERROR_MESSAGES.CART_CLEARED });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
