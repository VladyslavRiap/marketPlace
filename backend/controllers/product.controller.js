const pool = require("../config/db");
const queries = require("../queries/product.queries");

class ProductController {
  static fabricGetMethod(baseQuery, hasFilters = false) {
    return async (req, res) => {
      const {
        page = 1,
        limit = 10,
        query,
        category,
        minPrice,
        maxPrice,
        rating,
        sortBy = "id",
        order = "asc",
      } = req.query;

      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);
      const parsedRating = rating ? parseFloat(rating) : null;

      if (
        isNaN(parsedPage) ||
        isNaN(parsedLimit) ||
        parsedPage < 1 ||
        parsedLimit < 1
      ) {
        return res.status(400).json({ error: "Invalid page or limit value" });
      }

      if (
        rating &&
        (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5)
      ) {
        return res
          .status(400)
          .json({ error: "Rating must be between 0 and 5" });
      }

      const offset = (parsedPage - 1) * parsedLimit;
      let queryText = baseQuery;
      let values = [];
      let valueIndex = 1;

      if (hasFilters) {
        if (category) {
          queryText += ` AND category = $${valueIndex++}`;
          values.push(category);
        }
        if (minPrice) {
          queryText += ` AND price >= $${valueIndex++}`;
          values.push(minPrice);
        }
        if (maxPrice) {
          queryText += ` AND price <= $${valueIndex++}`;
          values.push(maxPrice);
        }
        if (parsedRating !== null) {
          queryText += ` AND rating >= $${valueIndex++}`;
          values.push(parsedRating);
        }
        if (query) {
          queryText += ` AND (name ILIKE $${valueIndex} OR description ILIKE $${valueIndex})`;
          values.push(`%${query}%`);
        }
      }

      const allowedSortFields = ["id", "name", "price", "rating"];
      const allowedOrder = ["asc", "desc"];

      const sortField = allowedSortFields.includes(sortBy) ? sortBy : "id";
      const sortOrder = allowedOrder.includes(order.toLowerCase())
        ? order.toUpperCase()
        : "ASC";

      queryText += ` ORDER BY ${sortField} ${sortOrder}`;
      queryText += ` LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
      values.push(parsedLimit, offset);

      try {
        const result = await pool.query(queryText, values);
        res.json(result.rows);
      } catch (error) {
        console.error("Error executing query:", error.message);
        res.status(500).json({ error: "Server error" });
      }
    };
  }

  static async getProductById(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query(queries.GET_PRODUCT_BY_ID, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Cannot receive product", error.message);
      res.status(500).json({ error: "Cannot receive product" });
    }
  }

  static async addProduct(req, res) {
    const { name, price, category, description, image_url } = req.body;

    const userId = req.user.userId;
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    try {
      const result = await pool.query(queries.INSERT_PRODUCT, [
        name,
        price,
        category,
        description,
        image_url,
        userId,
      ]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error adding new product:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async updateProduct(req, res) {
    const { id } = req.params;
    const { name, price, category, description, image_url } = req.body;
    const userId = req.user.userId;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    try {
      const productResult = await pool.query(queries.CHECK_PRODUCT_OWNER, [id]);
      if (productResult.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productUserId = productResult.rows[0].user_id;
      if (productUserId !== userId && req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this product" });
      }

      const result = await pool.query(queries.UPDATE_PRODUCT, [
        name,
        price,
        category,
        description,
        image_url,
        id,
      ]);

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating product:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async deleteProduct(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const productResult = await pool.query(queries.CHECK_PRODUCT_OWNER, [id]);
      if (productResult.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productUserId = productResult.rows[0].user_id;
      if (productUserId !== userId && req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this product" });
      }

      await pool.query(queries.DELETE_PRODUCT, [id]);
      res.json({ message: "Product successfully deleted" });
    } catch (error) {
      console.error("Error deleting product:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
}

ProductController.getProducts = ProductController.fabricGetMethod(
  queries.GET_PRODUCTS,
  true
);
ProductController.searchProducts = ProductController.fabricGetMethod(
  queries.GET_PRODUCTS,
  true
);
ProductController.filterProducts = ProductController.fabricGetMethod(
  queries.GET_PRODUCTS,
  true
);

module.exports = ProductController;
