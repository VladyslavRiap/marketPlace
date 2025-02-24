module.exports = {
  GET_PRODUCT_ID: "SELECT id FROM products WHERE id = $1",
  GET_userID_productId:
    "SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2",
  ADD_TO_FAVORITE:
    "INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *",
  GET_FAVORITE_LIST: `SELECT p.id, p.name, p.price, p.category, p.description, p.image_url 
    FROM favorites f
    JOIN products p ON f.product_id = p.id
    WHERE f.user_id = $1`,
  GET_FROM_FAVORITE: "SELECT id FROM favorites WHERE id = $1 AND user_id = $2",
  DELETE_FROM_FAVORITE: "DELETE FROM favorites WHERE id = $1",
};
