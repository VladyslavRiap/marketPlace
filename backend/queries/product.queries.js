module.exports = {
  GET_PRODUCTS: "SELECT * FROM products",

  GET_PRODUCT_BY_ID: "SELECT * FROM products WHERE id = $1",
  INSERT_PRODUCT:
    "INSERT INTO products (name, price, category, description, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
  UPDATE_PRODUCT:
    "UPDATE products SET name = $1, price = $2, category = $3, description = $4, image_url = $5 WHERE id = $6 RETURNING *",
  DELETE_PRODUCT: "DELETE FROM products WHERE id = $1",
  CHECK_PRODUCT_OWNER: "SELECT user_id FROM products WHERE id = $1",
};
