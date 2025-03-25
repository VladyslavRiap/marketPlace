module.exports = {
  createOrder: `
    INSERT INTO orders (user_id, delivery_address, estimated_delivery_date, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `,

  createOrderItem: `
  INSERT INTO order_items (order_id, product_id, seller_id, quantity, price)
  VALUES ($1, $2, $3, $4, $5)
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
SELECT * FROM orders
WHERE id = $1 AND user_id = $2;
`,

  GET_ORDERS_BY_BUYER: `
  SELECT 
    o.id, 
    o.delivery_address, 
    o.estimated_delivery_date, 
    o.status, 
    o.created_at, 
    o.updated_at,
    json_agg(json_build_object(
      'product_id', oi.product_id,
      'product_name', p.name,
      'quantity', oi.quantity,
      'price', oi.price,
      'status', oi.status,
      'cancel_reason', oi.cancel_reason,
      'images', (
        SELECT json_agg(pi.image_url)
        FROM product_images pi
        WHERE pi.product_id = p.id
      )
    )) AS items
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  JOIN products p ON oi.product_id = p.id
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
    json_agg(json_build_object(
      'product_id', oi.product_id,
      'product_name', p.name,
      'quantity', oi.quantity,
      'price', oi.price,
      'status', oi.status,
      'cancel_reason', oi.cancel_reason,
      'images', (
        SELECT json_agg(pi.image_url)
        FROM product_images pi
        WHERE pi.product_id = p.id
      )
    )) AS items
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  JOIN products p ON oi.product_id = p.id
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
