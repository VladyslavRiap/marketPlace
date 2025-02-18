const pool = require("../config/db");

exports.getProducts = async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = "SELECT * FROM products";
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
    console.error("Failed to fetch products", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.addProduct = async (req, res) => {
  const { name, price, category, description, image_url } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO products (name, price, category, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, price, category, description, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding item:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
