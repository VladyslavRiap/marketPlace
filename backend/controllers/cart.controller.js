const pool = require("../config/db");

exports.addToCart = async (req, res) => {
  const { userId } = req.user;
  const { productId, quantity = 1 } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id) DO UPDATE 
       SET quantity = cart_items.quantity + $3
       RETURNING *`,
      [userId, productId, quantity]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body;

  try {
    await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    res.json({ message: "Item removed from the cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.user;

  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.price, p.image_url, c.quantity, 
                (p.price * c.quantity) AS total_price
         FROM cart_items c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = $1`,
      [userId]
    );

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
};

exports.updateQuantityInCart = async (req, res) => {
  const { userId } = req.user;
  const { productId, quantityChange } = req.body;

  if (![1, -1].includes(quantityChange)) {
    return res.status(400).json({ error: "quantityChange must be +1 or -1" });
  }

  try {
    const cartItemResult = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    const cartItem = cartItemResult.rows[0];

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (quantityChange === -1 && cartItem.quantity <= 1) {
      return res
        .status(400)
        .json({ error: "Item quantity cannot be less than 1" });
    }

    const updatedCartItem = await pool.query(
      `UPDATE cart_items
         SET quantity = quantity + $1
         WHERE user_id = $2 AND product_id = $3
         RETURNING *`,
      [quantityChange, userId, productId]
    );

    res.json(updatedCartItem.rows[0]);
  } catch (error) {
    console.error("Error updating item quantity in cart:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
