module.exports = {
  GET_STATS_USERS: "SELECT COUNT(*) FROM users",
  GET_STATS_PRODUCTS: "SELECT COUNT(*) FROM products",

  UPDATE_PRODUCT: `
      UPDATE products
      SET name = $1, price = $2, category = $3, description = $4, image_url = $5
      WHERE id = $6
      RETURNING *`,

  DELETE_PRODUCT: "DELETE FROM products WHERE id = $1",
  GET_ALL_USERS: "SELECT id, email, is_blocked, name, role FROM users",

  BLOCK_USER: "UPDATE users SET is_blocked = true WHERE id = $1",

  UNBLOCK_USER: "UPDATE users SET is_blocked = false WHERE id = $1",
  GET_ADS_BY_POSITION: `
  SELECT * FROM ads 
  WHERE position = $1 AND is_active = true
  `,
  ADD_AD: `
  INSERT INTO ads (image_url, position, link_url, title) 
  VALUES ($1, $2, $3, $4) 
  RETURNING *
`,
  DELETE_AD: "DELETE FROM ads WHERE id = $1",
};
