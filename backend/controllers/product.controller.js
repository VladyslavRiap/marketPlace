const pool = require("../config/db");

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
    console.error("Не удалось получить продукты", error.message);
    res.status(500).json({ error: "Не удалось получить продукты" });
  }
};
exports.addProduct = async (req, res) => {
  const { name, price, category, description, image_url } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  if (category && !validCategories.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
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
