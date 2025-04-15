const NotificationService = require("../services/notification.service");
const ERROR_MESSAGES = require("../constants/messageErrors");

class NotificationController {
  static async getNotifications(req, res, next) {
    const { userId } = req.user;

    try {
      const notifications = await NotificationService.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  }

  static async getUnreadCount(req, res, next) {
    const { userId } = req.user;

    try {
      const count = await NotificationService.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;

    try {
      const notification = await NotificationService.getNotificationById(
        id,
        userId
      );
      if (!notification) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.NOTIFICATION_NOT_FOUND });
      }

      await NotificationService.markAsRead(id);
      res.json({ message: ERROR_MESSAGES.NOTIFICATION_MARKED_READ });
    } catch (error) {
      next(error);
    }
  }

  static async deleteNotification(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;

    try {
      const notification = await NotificationService.getNotificationById(
        id,
        userId
      );
      if (!notification) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.NOTIFICATION_NOT_FOUND });
      }

      await NotificationService.deleteNotification(id);
      res.json({ message: ERROR_MESSAGES.NOTIFICATION_DELETED });
    } catch (error) {
      next(error);
    }
  }

  static async createNotification({ userId, message }) {
    return await NotificationService.createNotification(userId, message);
  }
}

module.exports = NotificationController;
