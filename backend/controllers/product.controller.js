const pool = require("../config/db");
const queries = require("../queries/product.queries");

const uploadFile = require("../services/s3");

const validCategories = [
  "Phones, tablets and laptops",
  "Computers and peripheral devices",
  "TV, audio and photo",
  "Game",
  "Large electrical appliances",
  "Small electrical appliances",
  "Fashion",
  "Health and Beauty",
  "Home, Garden and Pet Shop",
  "Toys and children’s products",
  "Sports and Leisure",
  "Auto and DIY",
  "Books, office and food",
];
class ProductController {
  static fabricGetMethod(baseQuery, hasFilters = false) {
    return async (req, res) => {
      const {
        page = 1,
        limit = 12,
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

      if (category && !validCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }

      const offset = (parsedPage - 1) * parsedLimit;
      let queryText = baseQuery;
      let countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS total`;
      let values = [];
      let valueIndex = 1;

      let filters = [];

      if (hasFilters) {
        if (category) {
          filters.push(`category = $${valueIndex++}`);
          values.push(category);
        }
        if (minPrice) {
          filters.push(`price >= $${valueIndex++}`);
          values.push(minPrice);
        }
        if (maxPrice) {
          filters.push(`price <= $${valueIndex++}`);
          values.push(maxPrice);
        }
        if (parsedRating !== null) {
          filters.push(`rating >= $${valueIndex++}`);
          values.push(parsedRating);
        }

        if (filters.length > 0) {
          queryText += ` WHERE ` + filters.join(" AND ");
          countQuery += ` WHERE ` + filters.join(" AND ");
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
        const [productsResult, countResult] = await Promise.all([
          pool.query(queryText, values),
          pool.query(countQuery, values.slice(0, -2)),
        ]);

        const totalCount = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalCount / parsedLimit);

        res.json({
          products: productsResult.rows,
          totalPages,
          currentPage: parsedPage,
        });

        console.log({ totalPages, currentPage: parsedPage, totalCount });
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
    try {
      const { name, price, category, description, image_url } = req.body;
      const userId = req.user.userId;

      if (!name || !price) {
        return res.status(400).json({ error: "Name and price are required" });
      }

      let uploadedImageUrl = image_url || null;

      if (req.file) {
        if (!req.file.mimetype.startsWith("image/")) {
          return res
            .status(400)
            .json({ error: "Only image files are allowed" });
        }

        uploadedImageUrl = await uploadFile(
          "marketplace-my-1-2-3-4",
          req.file.originalname,
          req.file.buffer
        );
      }

      const result = await pool.query(queries.INSERT_PRODUCT, [
        name,
        price,
        category,
        description,
        uploadedImageUrl,
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
  static async searchProducts(req, res) {
    const { query, page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    if (
      isNaN(parsedPage) ||
      isNaN(parsedLimit) ||
      parsedPage < 1 ||
      parsedLimit < 1
    ) {
      return res.status(400).json({ error: "Invalid page or limit value" });
    }

    const offset = (parsedPage - 1) * parsedLimit;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    try {
      const searchQuery = `
        SELECT * FROM products 
        WHERE name ILIKE $1 
        LIMIT $2 OFFSET $3
      `;

      const countQuery = `
        SELECT COUNT(*) FROM products 
        WHERE name ILIKE $1
      `;

      const values = [`%${query}%`, parsedLimit, offset];

      const [productsResult, countResult] = await Promise.all([
        pool.query(searchQuery, values),
        pool.query(countQuery, [`%${query}%`]),
      ]);

      const totalCount = parseInt(countResult.rows[0].count, 10);
      const totalPages = Math.ceil(totalCount / parsedLimit);

      res.json({
        products: productsResult.rows,
        totalPages,
      });
    } catch (error) {
      console.error("Error searching products:", error.message);
      res.status(500).json({ error: "Cannot receive product" });
    }
  }
}

ProductController.getProducts = ProductController.fabricGetMethod(
  queries.GET_PRODUCTS,
  true
);
// ProductController.searchProducts = ProductController.fabricGetMethod(
//   queries.GET_PRODUCTS,
//   true
// );
ProductController.filterProducts = ProductController.fabricGetMethod(
  queries.GET_PRODUCTS,
  true
);

module.exports = ProductController;
