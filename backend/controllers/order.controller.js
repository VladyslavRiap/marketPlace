const OrderService = require("../services/order.service");
const NotificationController = require("./notification.controller");
const ERROR_MESSAGES = require("../constants/messageErrors");

class OrderController {
  static async createOrder(req, res, next) {
    try {
      const userId = req.user.userId;
      const { deliveryAddress, phone, firstName, lastName, city, region } =
        req.body;

      if (!phone || !firstName || !lastName || !city || !region) {
        return res.status(400).json({
          error: ERROR_MESSAGES.ORDER_REQUIRED_FIELDS,
        });
      }

      const cartItems = await OrderService.getCart(userId);
      if (!cartItems.length) {
        return res.status(400).json({ error: ERROR_MESSAGES.CART_EMPTY });
      }

      const order = await OrderService.createOrder(
        userId,
        deliveryAddress,
        phone,
        firstName,
        lastName,
        city,
        region
      );

      for (const item of cartItems) {
        await OrderService.createOrderItem(
          order.id,
          item.product_id,
          item.seller_id,
          item.quantity,
          item.price
        );

        await NotificationController.createNotification({
          userId: item.seller_id,
          message: `Новый заказ на товар: ${item.name}`,
        });
      }

      await OrderService.clearCart(userId);

      await NotificationController.createNotification({
        userId,
        message: `Ваш заказ №${order.id} успешно создан.`,
      });

      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { orderId, productId, status, cancelReason } = req.body;
      const userId = req.user.userId;
      const userRole = req.user.role;

      const orderItem = await OrderService.getOrderItem(orderId, productId);
      if (!orderItem) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.ORDER_ITEM_NOT_FOUND });
      }

      const updatedItem = await OrderService.updateOrderItemStatus(
        orderId,
        productId,
        status,
        cancelReason
      );

      await OrderService.updateOrderTimestamp(orderId);

      const notificationMessage = status.includes("cancelled")
        ? `Заказ №${orderId} отменен (${
            status === "cancelled_by_seller" ? "продавцом" : "покупателем"
          })`
        : `Статус товара в заказе №${orderId} изменен на: ${status}`;

      await NotificationController.createNotification({
        userId: status.includes("cancelled")
          ? status === "cancelled_by_seller"
            ? userId
            : orderItem.seller_id
          : userId,
        message: notificationMessage,
      });

      res.json({
        success: true,
        message: ERROR_MESSAGES.ORDER_STATUS_UPDATED,
        updatedItem,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrder(req, res, next) {
    try {
      const userId = req.user.userId;
      const orderId = req.params.id;

      const order = await OrderService.getOrderByIdAndUser(orderId, userId);
      if (!order) {
        return res.status(404).json({ error: ERROR_MESSAGES.ORDER_NOT_FOUND });
      }

      const orderItems = await OrderService.getOrderItems(orderId);
      res.json({ order, items: orderItems });
    } catch (error) {
      next(error);
    }
  }

  static async getOrdersByBuyer(req, res, next) {
    try {
      const userId = req.user.userId;
      const orders = await OrderService.getOrdersByBuyer(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getOrdersBySeller(req, res, next) {
    try {
      const userId = req.user.userId;
      const orders = await OrderService.getOrdersBySeller(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
