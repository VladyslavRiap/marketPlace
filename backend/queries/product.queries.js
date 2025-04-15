module.exports = {
  GET_PRODUCTS: `
    SELECT 
      p.id, 
      p.name, 
      p.price, 
      p.old_price,
      p.description, 
      p.image_url, 
      p.user_id, 
      p.rating,
      p.created_at, 
      p.updated_at,
      c.name AS category,
      s.name AS subcategory,
      CASE 
        WHEN p.old_price IS NOT NULL AND p.old_price > p.price 
        THEN ROUND(((p.old_price - p.price) / p.old_price * 100)) 
        ELSE NULL 
      END AS discount_percent,
      (
        SELECT json_agg(image_url)
        FROM product_images pi
        WHERE pi.product_id = p.id
      ) AS images
    FROM products p
    JOIN subcategories s ON p.subcategory_id = s.id
    JOIN categories c ON s.category_id = c.id
  `,

  GET_PRODUCT_BY_ID: `
   SELECT 
  p.id, 
  p.name, 
  p.price, 
  p.old_price,
  p.description, 
  p.image_url, 
  p.user_id, 
  p.created_at, 
  p.updated_at,
  p.rating,
  c.id AS category_id,        
  c.name AS category,
  s.name AS subcategory,
  CASE 
    WHEN p.old_price IS NOT NULL AND p.old_price > p.price 
    THEN ROUND(((p.old_price - p.price) / p.old_price * 100)) 
    ELSE NULL 
  END AS discount_percent,
  json_agg(json_build_object(
    'attribute_name', a.name,
    'attribute_value', pa.value
  )) AS attributes,
  (
    SELECT json_agg(image_url)
    FROM product_images pi
    WHERE pi.product_id = p.id
  ) AS images
FROM products p
JOIN subcategories s ON p.subcategory_id = s.id
JOIN categories c ON s.category_id = c.id
LEFT JOIN product_attributes pa ON p.id = pa.product_id
LEFT JOIN attributes a ON pa.attribute_id = a.id
WHERE p.id = $1
GROUP BY p.id, c.id, c.name, s.name   

  `,

  INSERT_PRODUCT: `
    INSERT INTO products (name, price, description, image_url, user_id, subcategory_id, old_price)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,

  UPDATE_PRODUCT: `
    UPDATE products 
    SET name = $1, price = $2, description = $3, image_url = $4, , old_price = $5
    WHERE id = $6
    RETURNING *
  `,

  DELETE_PRODUCT: "DELETE FROM products WHERE id = $1",

  CHECK_PRODUCT_OWNER: "SELECT user_id FROM products WHERE id = $1",

  GET_SUBCATEGORIES_BY_CATEGORY_ID: `
    SELECT id, name 
    FROM subcategories 
    WHERE category_id = $1
  `,

  GET_ATTRIBUTES_BY_SUBCATEGORY_ID: `
    SELECT id, name, type 
    FROM attributes 
    WHERE subcategory_id = $1
  `,

  INSERT_PRODUCT_ATTRIBUTES: `
    INSERT INTO product_attributes (product_id, attribute_id, value)
    VALUES ($1, $2, $3)
  `,

  DELETE_PRODUCT_ATTRIBUTES: `
    DELETE FROM product_attributes 
    WHERE product_id = $1
  `,

  CHECK_PRODUCT_EXISTENCE: `SELECT id FROM products WHERE id = $1;`,

  CHECK_ATTRIBUTE_EXISTENCE: `SELECT id FROM attributes WHERE id = $1;`,

  GET_PRODUCT_IMAGES: `SELECT image_url FROM product_images WHERE product_id = $1`,

  INSERT_PRODUCT_IMAGE: `
    INSERT INTO product_images (product_id, image_url) 
    VALUES ($1, $2)
  `,

  DELETE_PRODUCT_IMAGES: `DELETE FROM product_images WHERE product_id = $1`,

  SEARCH_PRODUCTS: (sortField, sortOrder) => `
  SELECT 
    p.*,
    CASE 
      WHEN p.old_price IS NOT NULL AND p.old_price > p.price 
      THEN ROUND(((p.old_price - p.price) / p.old_price * 100)) 
      ELSE NULL 
    END AS discount_percent,
    (
      SELECT json_agg(image_url)
      FROM product_images pi
      WHERE pi.product_id = p.id
    ) AS images
  FROM products p
  WHERE name ILIKE $1 
  ORDER BY ${sortField} ${sortOrder}
  LIMIT $2 OFFSET $3
`,

  COUNT_SEARCH_PRODUCTS: `
  SELECT COUNT(*) 
  FROM products 
  WHERE name ILIKE $1
`,

  GET_SELLER_PRODUCTS: `
    SELECT 
      p.*,
      CASE 
        WHEN p.old_price IS NOT NULL AND p.old_price > p.price 
        THEN ROUND(((p.old_price - p.price) / p.old_price * 100)) 
        ELSE NULL 
      END AS discount_percent,
      (SELECT json_agg(image_url) FROM product_images pi WHERE pi.product_id = p.id) AS images
    FROM products p 
    WHERE p.user_id = $1
  `,

  GET_CATEGORIES: `SELECT id, name FROM categories`,

  GET_SUBCATEGORIES: `SELECT id, name FROM subcategories`,

  GET_PRODUCTS_COUNT: `
  SELECT COUNT(*) 
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
`,

  GET_DISCOUNTED_PRODUCTS: `
  SELECT 
    p.id, 
    p.name, 
    p.price, 
    p.old_price, 
    p.description, 
    p.image_url, 
    p.user_id, 
    p.rating,
    p.created_at, 
    p.updated_at,
    p.view_count,
    p.purchase_count,
    p.subcategory_id,
    ROUND(((p.old_price - p.price) / p.old_price * 100)) AS discount_percent,
    (SELECT json_agg(image_url) FROM product_images pi WHERE pi.product_id = p.id) AS images
  FROM products p
  WHERE p.old_price IS NOT NULL AND p.old_price > p.price
  LIMIT 10
`,

  GET_TOP_SELLING_PRODUCTS: `
  SELECT 
    p.*,
    CASE 
      WHEN p.old_price IS NOT NULL AND p.old_price > p.price 
      THEN ROUND(((p.old_price - p.price) / p.old_price * 100)) 
      ELSE NULL 
    END AS discount_percent,
    (SELECT json_agg(image_url) FROM product_images pi WHERE pi.product_id = p.id) AS images
  FROM products p
  ORDER BY p.purchase_count DESC
  LIMIT $1
`,

  GET_TRENDING_PRODUCTS: `
  SELECT 
    p.*,
    CASE 
      WHEN p.old_price IS NOT NULL AND p.old_price > p.price 
      THEN ROUND(((p.old_price - p.price) / p.old_price * 100)) 
      ELSE NULL 
    END AS discount_percent,
    (SELECT json_agg(image_url) FROM product_images pi WHERE pi.product_id = p.id) AS images
  FROM products p
  ORDER BY p.view_count DESC
  LIMIT $1
`,

  INCREMENT_VIEW_COUNT: `
  UPDATE products
  SET view_count = view_count + 1
  WHERE id = $1
`,

  INCREMENT_PURCHASE_COUNT: `
  UPDATE products
  SET purchase_count = purchase_count + 1
  WHERE id = $1
`,
};
