const pool = require("../config/db");
const quires = require("../queries/admin.queries");

const uploadFile = require("../services/s3");
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
  static async addAd(req, res) {
    try {
      let imageUrls = [];

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const imageUrl = await uploadFile(
            "marketplace-my-1-2-3-4",
            file.originalname,
            file.buffer
          );
          imageUrls.push(imageUrl);
        }
      }

      if (imageUrls.length > 0) {
        const insertedAds = [];
        for (const imageUrl of imageUrls) {
          const result = await pool.query(quires.ADD_AD, [imageUrl]);
          insertedAds.push(result.rows[0]);
        }

        res.status(201).json(insertedAds);
      } else {
        res.status(400).json({ error: "No images were uploaded" });
      }
    } catch (error) {
      console.error("Error adding ad:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async deleteAd(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query(quires.DELETE_AD, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Ad not found" });
      }

      res.status(200).json({ message: "Ad deleted successfully" });
    } catch (error) {
      console.error("Error deleting ad:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getAds(req, res) {
    try {
      const result = await pool.query(quires.GET_ADS);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching ads:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
}
module.exports = AdminController;
