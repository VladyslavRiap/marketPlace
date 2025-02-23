const pool = require("../config/db");

exports.addToFavorites = async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const product = await pool.query("SELECT id FROM products WHERE id = $1", [
      productId,
    ]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingFavorite = await pool.query(
      "SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({ error: "Product already in favorites" });
    }

    const result = await pool.query(
      "INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *",
      [userId, productId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding to favorites:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFavorites = async (req, res) => {
  const { userId } = req.user;

  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.price, p.category, p.description, p.image_url 
       FROM favorites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.removeFromFavorites = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const favorite = await pool.query(
      "SELECT id FROM favorites WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (favorite.rows.length === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    await pool.query("DELETE FROM favorites WHERE id = $1", [id]);

    res.json({ message: "Product removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
