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

      const dbCartItems = await OrderService.getCart(userId);
      if (!dbCartItems || !dbCartItems.length) {
        return res.status(400).json({ error: ERROR_MESSAGES.CART_EMPTY });
      }

      const requestCartItems = req.body.cartItems || [];
      if (!Array.isArray(requestCartItems)) {
        return res.status(400).json({ error: "Invalid cart items format" });
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

      for (const dbItem of dbCartItems) {
        const requestItem =
          requestCartItems.find(
            (item) => item.product_id === dbItem.product_id
          ) || {};

        await OrderService.createOrderItem(
          order.id,
          dbItem.product_id,
          dbItem.seller_id,
          dbItem.quantity,
          dbItem.price,
          requestItem.color_id || null,
          requestItem.size_id || null
        );

        await NotificationController.createNotification({
          userId: dbItem.seller_id,
          message: `New order for product: ${dbItem.name}`,
        });
      }

      await OrderService.clearCart(userId);

      await NotificationController.createNotification({
        userId,
        message: `Your order #${order.id} has been created.`,
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
