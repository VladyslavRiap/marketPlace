const pool = require("../config/db");
const quires = require("../queries/admin.queries");
class AdminController {
  static async getStats(req, res) {
    try {
      const usersCount = await pool.query(quires.GET_STATS_USERS);
      const totalUsers = usersCount.rows[0].count;

      const productsCount = await pool.query(quires.GET_STATS_PRODUCTS);
      const totalProducts = productsCount.rows[0].count;

      res.json({
        totalUsers,
        totalProducts,
      });
    } catch (error) {
      console.error("Error fetching stats:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async updateProduct(req, res) {
    const { id } = req.params;
    const { name, price, category, description, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    try {
      const result = await pool.query(quires.UPDATE_PRODUCT, [
        name,
        price,
        category,
        description,
        image_url,
        id,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating product:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
  static async deleteProduct(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query(quires.DELETE_PRODUCT, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await pool.query(quires.GET_ALL_USERS);
      res.json(users.rows);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  static async blockUser(req, res) {
    try {
      await pool.query(quires.BLOCK_USER, [req.params.id]);
      res.json({ message: "User blocked successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  static async unblockUser(req, res) {
    try {
      await pool.query(quires.UNBLOCK_USER, [req.params.id]);
      res.json({ message: "User unblocked successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
}
module.exports = AdminController;
