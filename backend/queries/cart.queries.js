module.exports = {
  ADD_TO_CART: `INSERT INTO cart_items (user_id, product_id, quantity, color_id, size_id)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT ON CONSTRAINT unique_cart_item DO UPDATE 
  SET quantity = cart_items.quantity + EXCLUDED.quantity
  RETURNING *`,
  DELETE_FROM_CART:
    "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
  GET_CART: `SELECT 
  p.id, 
  p.name, 
  p.price, 
  p.image_url, 
  c.quantity, 
  c.color_id,
  c.size_id,
  col.name as color_name,
  s.name as size_name,
  (p.price * c.quantity) AS total_price,
  (
      SELECT json_agg(pi.image_url)
      FROM product_images pi
      WHERE pi.product_id = p.id
  ) AS images
FROM 
    cart_items c
JOIN 
    products p ON c.product_id = p.id
LEFT JOIN
    colors col ON c.color_id = col.id
LEFT JOIN
    sizes s ON c.size_id = s.id
WHERE 
    c.user_id = $1;
`,
  FIND_CART: "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
  UPDATE_QUANTITY: `UPDATE cart_items
  SET quantity = quantity + $1
  WHERE user_id = $2 AND product_id = $3
  RETURNING *`,
  DELETE_FULL_CART: "DELETE FROM cart_items WHERE user_id = $1",
};
