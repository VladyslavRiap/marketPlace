const pool = require("../config/db");
const queries = require("../queries/notification.queries");

class NotificationService {
  static async getNotifications(userId) {
    const result = await pool.query(queries.GET_NOTIFICATION, [userId]);
    return result.rows;
  }

  static async getUnreadCount(userId) {
    const result = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false",
      [userId]
    );
    return parseInt(result.rows[0].count);
  }

  static async getNotificationById(id, userId) {
    const result = await pool.query(queries.GET_NOTIFICATION_ID, [id, userId]);
    return result.rows[0];
  }

  static async markAsRead(id) {
    await pool.query(queries.SET_IS_READ, [id]);
  }

  static async deleteNotification(id) {
    await pool.query(queries.DELETE_NOTIFICATION, [id]);
  }

  static async createNotification(userId, message) {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, message, is_read)
       VALUES ($1, $2, false) RETURNING *`,
      [userId, message]
    );
    return result.rows[0];
  }
}

module.exports = NotificationService;
