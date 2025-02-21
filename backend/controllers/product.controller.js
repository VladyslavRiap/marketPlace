const pool = require("../config/db");

const categories = [
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

exports.getProducts = async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query =
      "SELECT id, name, price, category, description, image_url, user_id FROM products";
    let values = [];

    if (category) {
      query += " WHERE category = $1";
      values.push(category);
    }

    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Cannot receive products", error.message);
    res.status(500).json({ error: "Cannot receive products" });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, name, price, category, description, image_url, user_id FROM products WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Cannot receive product", error.message);
    res.status(500).json({ error: "Cannot receive product" });
  }
};

exports.addProduct = async (req, res) => {
  const { name, price, category, description, image_url } = req.body;
  const userId = req.user.userId;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  if (!categories.includes(category)) {
    return res.status(400).json({ error: "Category does not exist" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO products (name, price, category, description, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, price, category, description, image_url, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding new product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, description, image_url } = req.body;
  const userId = req.user.userId;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  if (!categories.includes(category)) {
    return res.status(400).json({ error: "Category does not exist" });
  }

  try {
    const productResult = await pool.query(
      "SELECT user_id FROM products WHERE id = $1",
      [id]
    );
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productUserId = productResult.rows[0].user_id;
    if (productUserId !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this product" });
    }

    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, category = $3, description = $4, image_url = $5 WHERE id = $6 RETURNING *",
      [name, price, category, description, image_url, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const productResult = await pool.query(
      "SELECT user_id FROM products WHERE id = $1",
      [id]
    );
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productUserId = productResult.rows[0].user_id;
    if (productUserId !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this product" });
    }

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({ message: "Product successfully deleted" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.searchProducts = async (req, res) => {
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
      OR description ILIKE $1 
      OR category ILIKE $1 
      LIMIT $2 OFFSET $3
    `;

    const values = [`%${query}%`, parsedLimit, offset];

    const result = await pool.query(searchQuery, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error searching products:", error.message);
    res.status(500).json({ error: "Cannot receive product" });
  }
};
