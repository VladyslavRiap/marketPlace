const pool = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const usersCount = await pool.query("SELECT COUNT(*) FROM users");
    const totalUsers = usersCount.rows[0].count;

    const productsCount = await pool.query("SELECT COUNT(*) FROM products");
    const totalProducts = productsCount.rows[0].count;

    res.json({
      totalUsers,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching stats:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, description, image_url } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE products
       SET name = $1, price = $2, category = $3, description = $4, image_url = $5
       WHERE id = $6
       RETURNING *`,
      [name, price, category, description, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, email, is_blocked, name, role FROM users"
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    await pool.query("UPDATE users SET is_blocked = true WHERE id = $1", [
      req.params.id,
    ]);
    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    await pool.query("UPDATE users SET is_blocked = false WHERE id = $1", [
      req.params.id,
    ]);
    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
