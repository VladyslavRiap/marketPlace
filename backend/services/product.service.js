const pool = require("../config/db");
const queries = require("../queries/product.queries");

class ProductService {
  static async getProducts(queryParams, baseQuery, hasFilters) {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      minPrice,
      maxPrice,
      rating,
      sortBy = "id",
      order = "asc",
    } = queryParams;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const parsedRating = rating ? parseFloat(rating) : null;

    const offset = (parsedPage - 1) * parsedLimit;
    let queryText = baseQuery;
    let countQuery = queries.GET_PRODUCTS_COUNT;

    let values = [];
    let valueIndex = 1;
    let filters = [];

    if (hasFilters) {
      if (category) {
        filters.push(`c.name = $${valueIndex++}`);
        values.push(category);
      }
      if (subcategory) {
        filters.push(`s.name = $${valueIndex++}`);
        values.push(subcategory);
      }
      if (minPrice) {
        filters.push(`p.price >= $${valueIndex++}`);
        values.push(minPrice);
      }
      if (maxPrice) {
        filters.push(`p.price <= $${valueIndex++}`);
        values.push(maxPrice);
      }
      if (parsedRating !== null) {
        filters.push(`p.rating >= $${valueIndex++}`);
        values.push(parsedRating);
      }

      if (filters.length > 0) {
        queryText += ` WHERE ` + filters.join(" AND ");
        countQuery += ` WHERE ` + filters.join(" AND ");
      }
    }

    const allowedSortFields = ["id", "name", "price", "rating"];
    const allowedOrder = ["asc", "desc"];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "id";
    const sortOrder = allowedOrder.includes(order.toLowerCase())
      ? order.toUpperCase()
      : "ASC";

    queryText += ` ORDER BY ${sortField} ${sortOrder}`;
    queryText += ` LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
    values.push(parsedLimit, offset);

    const [productsResult, countResult] = await Promise.all([
      pool.query(queryText, values),
      pool.query(countQuery, values.slice(0, -2)),
    ]);

    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / parsedLimit);

    return {
      products: productsResult.rows,
      totalPages,
      currentPage: parsedPage,
    };
  }

  static async getProductById(id) {
    const productResult = await pool.query(queries.GET_PRODUCT_BY_ID, [id]);
    if (productResult.rows.length === 0) return null;

    const imagesResult = await pool.query(queries.GET_PRODUCT_IMAGES, [id]);

    const product = productResult.rows[0];
    product.images = imagesResult.rows.map((row) => row.image_url);
    return product;
  }

  static async addProduct(name, price, description, subcategory_id, userId) {
    const result = await pool.query(queries.INSERT_PRODUCT, [
      name,
      price,
      description,
      null,
      userId,
      subcategory_id,
      null,
    ]);
    return result.rows[0];
  }

  static async addProductImage(productId, imageUrl) {
    await pool.query(queries.INSERT_PRODUCT_IMAGE, [productId, imageUrl]);
  }

  static async checkProductExistence(id) {
    const result = await pool.query(queries.CHECK_PRODUCT_EXISTENCE, [id]);
    return result.rows.length > 0;
  }

  static async checkProductOwner(id) {
    const result = await pool.query(queries.CHECK_PRODUCT_OWNER, [id]);
    return result.rows[0];
  }

  static async updateProduct(id, updatedFields) {
    const currentProduct = await pool.query(
      "SELECT price FROM products WHERE id = $1",
      [id]
    );
    const currentPrice = currentProduct.rows[0]?.price;

    if (
      currentPrice &&
      updatedFields.price &&
      currentPrice !== updatedFields.price
    ) {
      updatedFields.old_price = currentPrice;
    }

    const updateColumns = Object.keys(updatedFields)
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");
    const updateValues = Object.values(updatedFields);

    const updateQuery = `
      UPDATE products
      SET ${updateColumns}
      WHERE id = $${updateValues.length + 1}
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [...updateValues, id]);
    return result.rows[0];
  }

  static async deleteProductImages(productId) {
    await pool.query(queries.DELETE_PRODUCT_IMAGES, [productId]);
  }

  static async deleteProductAttributes(productId) {
    await pool.query(queries.DELETE_PRODUCT_ATTRIBUTES, [productId]);
  }

  static async deleteProduct(productId) {
    await pool.query(queries.DELETE_PRODUCT, [productId]);
  }
  static async deleteProductColors(productId) {
    await pool.query(queries.DELETE_PRODUCT_COLORS, [productId]);
  }
  static async deleteProductSizes(productId) {
    await pool.query(queries.DELETE_PRODUCT_SIZES, [productId]);
  }
  static async addProductAttributes(productId, attributes) {
    for (const attr of attributes) {
      await pool.query(queries.INSERT_PRODUCT_ATTRIBUTES, [
        productId,
        attr.attribute_id,
        attr.value,
      ]);
    }
  }

  static async checkAttributeExistence(attributeId) {
    const result = await pool.query(queries.CHECK_ATTRIBUTE_EXISTENCE, [
      attributeId,
    ]);
    return result.rows.length > 0;
  }

  static async getSubcategoriesByCategoryId(categoryId) {
    const result = await pool.query(queries.GET_SUBCATEGORIES_BY_CATEGORY_ID, [
      categoryId,
    ]);
    return result.rows;
  }

  static async getAttributesBySubcategoryId(subcategoryId) {
    const result = await pool.query(queries.GET_ATTRIBUTES_BY_SUBCATEGORY_ID, [
      subcategoryId,
    ]);
    return result.rows;
  }

  static async searchProducts(
    query,
    page = 1,
    limit = 10,
    sortBy = "name",
    order = "asc"
  ) {
    const allowedSortFields = ["name", "price", "rating"];
    const allowedOrder = ["asc", "desc"];
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const offset = (parsedPage - 1) * parsedLimit;
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const sortOrder = allowedOrder.includes(order.toLowerCase())
      ? order.toUpperCase()
      : "ASC";
    const [productsResult, countResult] = await Promise.all([
      pool.query(queries.SEARCH_PRODUCTS(sortField, sortOrder), [
        `%${query}%`,
        parsedLimit,
        offset,
      ]),
      pool.query(queries.COUNT_SEARCH_PRODUCTS, [`%${query}%`]),
    ]);

    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / parsedLimit);

    return {
      products: productsResult.rows,
      totalPages,
    };
  }

  static async getSellerProducts(userId) {
    const result = await pool.query(queries.GET_SELLER_PRODUCTS, [userId]);
    return result.rows;
  }

  static async getCategories() {
    const result = await pool.query(queries.GET_CATEGORIES);
    return result.rows;
  }

  static async getSubCategories() {
    const result = await pool.query(queries.GET_SUBCATEGORIES);
    return result.rows;
  }
  static async getDiscountedProducts() {
    const result = await pool.query(queries.GET_DISCOUNTED_PRODUCTS);
    return result.rows;
  }

  static async getTopSellingProducts(limit = 10) {
    const result = await pool.query(queries.GET_TOP_SELLING_PRODUCTS, [limit]);
    return result.rows;
  }

  static async getTrendingProducts(limit = 10) {
    const result = await pool.query(queries.GET_TRENDING_PRODUCTS, [limit]);
    return result.rows;
  }

  static async incrementViewCount(productId) {
    await pool.query(queries.INCREMENT_VIEW_COUNT, [productId]);
  }

  static async incrementPurchaseCount(productId) {
    await pool.query(queries.INCREMENT_PURCHASE_COUNT, [productId]);
  }

  static async getColors() {
    const result = await pool.query(queries.GET_COLORS);
    return result.rows;
  }

  static async getSizes() {
    const result = await pool.query(queries.GET_SIZES);
    return result.rows;
  }

  static async getProductColors(productId) {
    const result = await pool.query(queries.GET_PRODUCT_COLORS, [productId]);
    return result.rows;
  }

  static async getProductSizes(productId) {
    const result = await pool.query(queries.GET_PRODUCT_SIZES, [productId]);
    return result.rows;
  }

  static async addProductColors(productId, colors) {
    await pool.query(queries.DELETE_PRODUCT_COLORS, [productId]);
    for (const colorId of colors) {
      await pool.query(queries.INSERT_PRODUCT_COLOR, [productId, colorId]);
    }
  }

  static async addProductSizes(productId, sizes) {
    await pool.query(queries.DELETE_PRODUCT_SIZES, [productId]);
    for (const sizeId of sizes) {
      await pool.query(queries.INSERT_PRODUCT_SIZE, [productId, sizeId]);
    }
  }

  static async checkColorExistence(colorId) {
    const result = await pool.query(queries.CHECK_COLOR_EXISTENCE, [colorId]);
    return result.rows.length > 0;
  }

  static async checkSizeExistence(sizeId) {
    const result = await pool.query(queries.CHECK_SIZE_EXISTENCE, [sizeId]);
    return result.rows.length > 0;
  }
}
module.exports = ProductService;
