const pool = require("../config/db");
const CategoryService = require("./category.service");
const ProductService = require("./product.service");

class RecommendationService {
  static async getPersonalizedProducts(userId, limit = 10) {
    try {
      const topCategories = await CategoryService.getTopCategoriesForUser(
        userId
      );

      if (topCategories.length === 0) {
        return this.getPopularProducts(limit);
      }

      const result = await pool.query(
        `
          SELECT 
            p.*,
            c.name AS category,
            s.name AS subcategory,
            CASE 
              WHEN p.old_price IS NOT NULL AND p.old_price > p.price 
              THEN ROUND(((p.old_price - p.price) / p.old_price * 100)) 
              ELSE NULL 
            END AS discount_percent,
            (SELECT json_agg(image_url) FROM product_images pi WHERE pi.product_id = p.id) AS images
          FROM products p
          JOIN subcategories s ON p.subcategory_id = s.id
          JOIN categories c ON s.category_id = c.id
          WHERE c.id = ANY($1)
          ORDER BY 
       
            array_position($1, c.id),
    
            p.rating DESC,
            p.purchase_count DESC,
            p.view_count DESC
          LIMIT $2
        `,
        [topCategories, limit]
      );

      return result.rows;
    } catch (error) {
      console.error("Error in getPersonalizedProducts:", error);
      throw error;
    }
  }

  static async getPopularProducts(limit = 10) {
    const result = await pool.query(
      `
        SELECT 
          p.*,
          c.name AS category,
          s.name AS subcategory,
          CASE 
            WHEN p.old_price IS NOT NULL AND p.old_price > p.price 
            THEN ROUND(((p.old_price - p.price) / p.old_price * 100)) 
            ELSE NULL 
          END AS discount_percent,
          (SELECT json_agg(image_url) FROM product_images pi WHERE pi.product_id = p.id) AS images
        FROM products p
        JOIN subcategories s ON p.subcategory_id = s.id
        JOIN categories c ON s.category_id = c.id
        ORDER BY p.rating DESC, p.purchase_count DESC
        LIMIT $1
      `,
      [limit]
    );

    return result.rows;
  }
}

module.exports = RecommendationService;
