module.exports = {
  GET_NOTIFICATION:
    "SELECT id, message, is_read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
  GET_NOTIFICATION_ID:
    "SELECT id FROM notifications WHERE id = $1 AND user_id = $2",
  SET_IS_READ: "UPDATE notifications SET is_read = true WHERE id = $1",
  DELETE_NOTIFICATION: "DELETE FROM notifications WHERE id = $1",
};
