const pool = require("../config/db");
class CategoryService {
  static async trackCategoryView(userId, categoryId) {
    await pool.query(
      `
        INSERT INTO user_category_views (user_id, category_id) 
        VALUES ($1, $2)
        ON CONFLICT (user_id, category_id) 
        DO UPDATE SET 
          view_count = user_category_views.view_count + 1,
          last_viewed = CURRENT_TIMESTAMP
      `,
      [userId, categoryId]
    );
  }

  static async getTopCategoriesForUser(userId, limit = 3) {
    const result = await pool.query(
      `
        SELECT category_id 
        FROM user_category_views 
        WHERE user_id = $1
        ORDER BY view_count DESC, last_viewed DESC
        LIMIT $2
      `,
      [userId, limit]
    );

    return result.rows.map((row) => row.category_id);
  }
}

module.exports = CategoryService;
