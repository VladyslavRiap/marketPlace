const pool = require("../config/db");
const queries = require("../queries/notification.queries");

class NotificationController {
  static async getNotifications(req, res) {
    const { userId } = req.user;

    try {
      const result = await pool.query(queries.GET_NOTIFICATION, [userId]);

      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async markAsRead(req, res) {
    const { id } = req.params;
    const { userId } = req.user;

    try {
      const notification = await pool.query(queries.GET_NOTIFICATION_ID, [
        id,
        userId,
      ]);

      if (notification.rows.length === 0) {
        return res.status(404).json({ error: "Notification not found" });
      }

      await pool.query(queries.SET_IS_READ, [id]);

      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async deleteNotification(req, res) {
    const { id } = req.params;
    const { userId } = req.user;

    try {
      const notification = await pool.query(queries.GET_NOTIFICATION_ID, [
        id,
        userId,
      ]);

      if (notification.rows.length === 0) {
        return res.status(404).json({ error: "Notification not found" });
      }

      await pool.query(queries.DELETE_NOTIFICATION, [id]);

      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async createNotification({ userId, message }) {
    const query = `
      INSERT INTO notifications (user_id, message, is_read)
      VALUES ($1, $2, false)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, message]);
    return result.rows[0];
  }
}

module.exports = NotificationController;
