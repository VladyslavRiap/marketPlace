module.exports = {
  INSERT_REVIEW: `
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES ($1, $2, $3, $4)`,

  UPDATE_PRODUCT_RATING: `
      UPDATE products 
      SET rating = (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE product_id = $1) 
      WHERE id = $1`,

  GET_REVIEWS_BY_PRODUCT: `
      SELECT r.id, r.rating, r.comment, r.created_at, u.email AS user_email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1`,

  GET_REVIEW_BY_ID: `
      SELECT user_id FROM reviews WHERE id = $1`,

  UPDATE_REVIEW: `
      UPDATE reviews
      SET rating = COALESCE($1, rating),
          comment = COALESCE($2, comment),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *`,

  DELETE_REVIEW: `
      DELETE FROM reviews WHERE id = $1`,
  GET_REVIEW_ID: "SELECT id FROM products WHERE id = $1",
};
