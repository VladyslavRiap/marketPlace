module.exports = {
  GET_PRODUCTS: `
    SELECT 
      p.id, 
      p.name, 
      p.price, 
      p.description, 
      p.image_url, 
      p.user_id, 
      p.created_at, 
      p.updated_at,
      c.name AS category,
      s.name AS subcategory,
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
      p.description, 
      p.image_url, 
      p.user_id, 
      p.created_at, 
      p.updated_at,
      c.name AS category,
      s.name AS subcategory,
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
    GROUP BY p.id, c.name, s.name
  `,

  INSERT_PRODUCT: `
    INSERT INTO products (name, price, description, image_url, user_id, subcategory_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,

  UPDATE_PRODUCT: `
    UPDATE products 
    SET name = $1, price = $2, description = $3, image_url = $4, subcategory_id = $5
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
};
