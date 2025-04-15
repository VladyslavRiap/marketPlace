const pool = require("../config/db");
const quires = require("../queries/admin.queries");

class AdminService {
  static async getStats() {
    const usersCount = await pool.query(quires.GET_STATS_USERS);
    const productsCount = await pool.query(quires.GET_STATS_PRODUCTS);

    return {
      totalUsers: usersCount.rows[0].count,
      totalProducts: productsCount.rows[0].count,
    };
  }

  static async updateProduct(id, productData) {
    const { name, price, category, description, image_url } = productData;
    const result = await pool.query(quires.UPDATE_PRODUCT, [
      name,
      price,
      category,
      description,
      image_url,
      id,
    ]);
    return result.rows[0];
  }

  static async deleteProduct(id) {
    const result = await pool.query(quires.DELETE_PRODUCT, [id]);
    return result.rowCount;
  }

  static async getAllUsers() {
    const result = await pool.query(quires.GET_ALL_USERS);
    return result.rows;
  }

  static async blockUser(id) {
    await pool.query(quires.BLOCK_USER, [id]);
  }

  static async unblockUser(id) {
    await pool.query(quires.UNBLOCK_USER, [id]);
  }

  static async addAd(adData) {
    const { imageUrl, position, linkUrl, title } = adData;
    const result = await pool.query(quires.ADD_AD, [
      imageUrl,
      position,
      linkUrl,
      title,
    ]);
    return result.rows[0];
  }

  static async deleteAd(id) {
    const result = await pool.query(quires.DELETE_AD, [id]);
    return result.rowCount;
  }

  static async getAdsByPosition(position) {
    const result = await pool.query(quires.GET_ADS_BY_POSITION, [position]);
    return result.rows;
  }
}

module.exports = AdminService;
