const pool = require("../config/db");

exports.getNotifications = async (req, res) => {
  const { userId } = req.user;

  try {
    const result = await pool.query(
      "SELECT id, message, is_read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const notification = await pool.query(
      "SELECT id FROM notifications WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (notification.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await pool.query("UPDATE notifications SET is_read = true WHERE id = $1", [
      id,
    ]);

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteNotification = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const notification = await pool.query(
      "SELECT id FROM notifications WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (notification.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await pool.query("DELETE FROM notifications WHERE id = $1", [id]);

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
