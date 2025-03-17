const pool = require("../config/db");
const queries = require("../queries/product.queries");

const uploadFile = require("../services/s3");

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

      const offset = (parsedPage - 1) * parsedLimit;
      let queryText = baseQuery;
      let countQuery = `
      SELECT COUNT(*) 
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      JOIN categories c ON s.category_id = c.id
    `;

      let values = [];
      let valueIndex = 1;

      let filters = [];

      if (hasFilters) {
        if (category) {
          filters.push(`c.name = $${valueIndex++}`);
          values.push(category);
        }
        if (minPrice) {
          filters.push(`p.price >= $${valueIndex++}`);
          values.push(minPrice);
        }
        if (maxPrice) {
          filters.push(`p.price <= $${valueIndex++}`);
          values.push(maxPrice);
        }
        if (parsedRating !== null) {
          filters.push(`p.rating >= $${valueIndex++}`);
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
      } catch (error) {
        console.error("Error executing query:", error.message);
        res.status(500).json({ error: "Server error" });
      }
    };
  }
  static async getProductById(req, res) {
    const { id } = req.params;

    try {
      const productResult = await pool.query(queries.GET_PRODUCT_BY_ID, [id]);

      if (productResult.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const imagesResult = await pool.query(
        `SELECT image_url FROM product_images WHERE product_id = $1`,
        [id]
      );

      const product = productResult.rows[0];
      product.images = imagesResult.rows.map((row) => row.image_url);

      res.json(product);
    } catch (error) {
      console.error("Cannot receive product", error.message);
      res.status(500).json({ error: "Cannot receive product" });
    }
  }

  static async addProduct(req, res) {
    try {
      const { name, price, description, subcategory_id } = req.body;
      const userId = req.user.userId;

      if (!name || !price || !subcategory_id) {
        return res
          .status(400)
          .json({ error: "Name, price, and subcategory are required" });
      }

      const productResult = await pool.query(queries.INSERT_PRODUCT, [
        name,
        price,
        description,
        null,
        userId,
        subcategory_id,
      ]);

      const productId = productResult.rows[0].id;

      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const imageUrl = await uploadFile(
            "marketplace-my-1-2-3-4",
            file.originalname,
            file.buffer
          );
          imageUrls.push(imageUrl);

          await pool.query(
            `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
            [productId, imageUrl]
          );
        }
      }

      res.status(201).json({ id: productId, images: imageUrls });
    } catch (error) {
      console.error("Error adding new product:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async addProductAttributes(req, res) {
    const client = await pool.connect();

    try {
      const { productId } = req.params;
      const { attributes } = req.body;

      console.log(productId, attributes);

      if (!productId || !attributes || attributes.length === 0) {
        return res
          .status(400)
          .json({ error: "ProductId and attributes are required" });
      }

      await client.query("BEGIN");

      const productCheck = await client.query(queries.CHECK_PRODUCT_EXISTENCE, [
        productId,
      ]);
      if (productCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Product not found" });
      }

      for (const attr of attributes) {
        const attributeCheck = await client.query(
          queries.CHECK_ATTRIBUTE_EXISTENCE,
          [attr.attribute_id]
        );

        if (attributeCheck.rows.length === 0 || attr.attribute_id === 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            error: `Attribute with ID ${attr.attribute_id} does not exist or is invalid.`,
          });
        }

        await client.query(queries.INSERT_PRODUCT_ATTRIBUTES, [
          productId,
          attr.attribute_id,
          attr.value,
        ]);
      }

      await client.query("COMMIT");
      res.status(200).json({ message: "Attributes added successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error adding product attributes:", error.message);
      res.status(500).json({ error: "Server error" });
    } finally {
      client.release();
    }
  }

  static async updateProduct(req, res) {
    const { id } = req.params;
    const { name, price, description, subcategory_id, attributes } = req.body;
    const userId = req.user.userId;

    if (!name || !price || !subcategory_id) {
      return res
        .status(400)
        .json({ error: "Name, price, and subcategory are required" });
    }

    try {
      const productResult = await pool.query(queries.CHECK_PRODUCT_OWNER, [id]);
      if (productResult.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = productResult.rows[0];
      const productUserId = product.user_id;

      if (productUserId !== userId && req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this product" });
      }

      const updatedFields = {
        name,
        price,
        description,
        subcategory_id,
      };

      const updateColumns = Object.keys(updatedFields)
        .map((field, index) => `${field} = $${index + 1}`)
        .join(", ");
      const updateValues = Object.values(updatedFields);

      const updateQuery = `
        UPDATE products
        SET ${updateColumns}
        WHERE id = $${updateValues.length + 1}
        RETURNING *;
      `;
      const result = await pool.query(updateQuery, [...updateValues, id]);

      if (req.files && req.files.length > 0) {
        await pool.query(`DELETE FROM product_images WHERE product_id = $1`, [
          id,
        ]);

        let imageUrls = [];
        for (const file of req.files) {
          const imageUrl = await uploadFile(
            "marketplace-my-1-2-3-4",
            file.originalname,
            file.buffer
          );
          imageUrls.push(imageUrl);

          await pool.query(
            `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
            [id, imageUrl]
          );
        }
      }

      await pool.query(queries.DELETE_PRODUCT_ATTRIBUTES, [id]);

      if (attributes && attributes.length > 0) {
        for (const attr of attributes) {
          await pool.query(queries.INSERT_PRODUCT_ATTRIBUTES, [
            id,
            attr.attribute_id,
            attr.value,
          ]);
        }
      }

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

      await pool.query(queries.DELETE_PRODUCT_ATTRIBUTES, [id]);
      await pool.query(queries.DELETE_PRODUCT, [id]);
      res.json({ message: "Product successfully deleted" });
    } catch (error) {
      console.error("Error deleting product:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getSubcategoriesByCategoryId(req, res) {
    const { categoryId } = req.params;

    try {
      const result = await pool.query(
        queries.GET_SUBCATEGORIES_BY_CATEGORY_ID,
        [categoryId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getAttributesBySubcategoryId(req, res) {
    const { subcategoryId } = req.params;

    try {
      const result = await pool.query(
        queries.GET_ATTRIBUTES_BY_SUBCATEGORY_ID,
        [subcategoryId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching attributes:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
  static async searchProducts(req, res) {
    const {
      query,
      page = 1,
      limit = 10,
      sortBy = "name",
      order = "asc",
    } = req.query;
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

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const allowedSortFields = ["name", "price", "rating"];
    const allowedOrder = ["asc", "desc"];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const sortOrder = allowedOrder.includes(order.toLowerCase())
      ? order.toUpperCase()
      : "ASC";

    const offset = (parsedPage - 1) * parsedLimit;

    try {
      const searchQuery = `
        SELECT 
          p.*,
          (
            SELECT json_agg(image_url)
            FROM product_images pi
            WHERE pi.product_id = p.id
          ) AS images
        FROM products p
        WHERE name ILIKE $1 
        ORDER BY ${sortField} ${sortOrder}
        LIMIT $2 OFFSET $3
      `;

      const countQuery = `
        SELECT COUNT(*) 
        FROM products 
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
  static async getSellerProducts(req, res) {
    const userId = req.user?.userId;

    if (!userId || isNaN(userId)) {
      console.error("❌ Ошибка: userId невалидный:", userId);
      return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
      const result = await pool.query(
        `
        SELECT 
          p.*,
          (
            SELECT json_agg(image_url)
            FROM product_images pi
            WHERE pi.product_id = p.id
          ) AS images
        FROM products p
        WHERE p.user_id = $1
        `,
        [userId]
      );

      res.json(result.rows.length > 0 ? result.rows : []);
    } catch (error) {
      console.error("❌ Ошибка при запросе товаров продавца:", error.message);
      res.status(500).json({ error: "Cannot fetch seller products" });
    }
  }
  static async getCategories(req, res) {
    try {
      const result = await pool.query("SELECT id, name FROM categories");
      res.json(result.rows);
    } catch (error) {
      console.error("Ошибка при получении категорий:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
}

ProductController.getProducts = ProductController.fabricGetMethod(
  queries.GET_PRODUCTS,
  true
);

ProductController.filterProducts = ProductController.fabricGetMethod(
  queries.GET_PRODUCTS,
  true
);

module.exports = ProductController;
