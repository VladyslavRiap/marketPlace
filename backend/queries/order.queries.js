module.exports = {
  createOrder: `
  INSERT INTO orders (user_id, delivery_address, estimated_delivery_date, status, phone, first_name, last_name, city, region)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *;
`,

  createOrderItem: `
  INSERT INTO order_items (order_id, product_id, seller_id, quantity, price, color_id, size_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`,
  updateProductStatus: `
    UPDATE order_items
    SET status = $1
    WHERE order_id = $2 AND product_id = $3 AND seller_id = $4
    RETURNING *;
  `,

  updateOrderTimestamp: `
    UPDATE orders
    SET updated_at = NOW()
    WHERE id = $1;
  `,

  getOrderById: `
    SELECT * FROM orders
    WHERE id = $1;
  `,
  clearCart: `
    DELETE FROM cart_items
    WHERE user_id = $1;
  `,
  GET_CART: `SELECT 
  p.id AS product_id, 
  p.user_id AS seller_id,  -- Используем user_id как seller_id
  p.name, 
  p.price, 
  p.image_url, 
  c.quantity, 
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
WHERE 
    c.user_id = $1;
`,
  getOrderByIdAndUser: `
  SELECT 
    o.* 
  FROM orders o
  WHERE o.id = $1 AND o.user_id = $2;
`,

  GET_ORDERS_BY_BUYER: `
  SELECT 
    o.id, 
    o.delivery_address, 
    o.estimated_delivery_date, 
    o.status, 
    o.created_at, 
    o.updated_at,
    o.phone,
    o.first_name,
    o.last_name,
    o.city,
    o.region,
    json_agg(json_build_object(
      'product_id', oi.product_id,
      'product_name', p.name,
      'quantity', oi.quantity,
      'price', oi.price,
      'status', oi.status,
      'cancel_reason', oi.cancel_reason,
      'color_id', oi.color_id,
      'color_name', col.name,
      'size_id', oi.size_id,
      'size_name', s.name,
      'images', (
        SELECT json_agg(pi.image_url)
        FROM product_images pi
        WHERE pi.product_id = p.id
      )
    )) AS items
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  JOIN products p ON oi.product_id = p.id
  LEFT JOIN colors col ON oi.color_id = col.id
  LEFT JOIN sizes s ON oi.size_id = s.id
  WHERE o.user_id = $1
  GROUP BY o.id
`,

  GET_ORDERS_BY_SELLER: `
SELECT 
  o.id, 
  o.delivery_address, 
  o.estimated_delivery_date, 
  o.status, 
  o.created_at, 
  o.updated_at,
  o.phone,
  o.first_name,
  o.last_name,
  o.city,
  o.region,
  json_agg(json_build_object(
    'product_id', oi.product_id,
    'product_name', p.name,
    'quantity', oi.quantity,
    'price', oi.price,
    'status', oi.status,
    'cancel_reason', oi.cancel_reason,
    'color_id', oi.color_id,
    'color_name', col.name,
    'size_id', oi.size_id,
    'size_name', s.name,
    'images', (
      SELECT json_agg(pi.image_url)
      FROM product_images pi
      WHERE pi.product_id = p.id
    )
  )) AS items
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
LEFT JOIN colors col ON oi.color_id = col.id
LEFT JOIN sizes s ON oi.size_id = s.id
WHERE p.user_id = $1
GROUP BY o.id
`,

  getOrderItems: `
  SELECT 
    oi.id,
    oi.product_id,
    p.name AS product_name,
    p.price,
    (
      SELECT json_agg(image_url)
      FROM product_images pi
      WHERE pi.product_id = p.id
    ) AS images,
    oi.quantity,
    oi.status,
    oi.cancel_reason,
    oi.created_at,
    oi.updated_at
  FROM 
    order_items oi
  JOIN 
    products p ON oi.product_id = p.id
  WHERE 
    oi.order_id = $1;
`,
};
