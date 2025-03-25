const pool = require("../config/db");
const OrderQueries = require("../queries/order.queries");
const NotificationController = require("../controllers/notification.controller");
const moment = require("moment");

class OrderController {
  static async createOrder(req, res) {
    try {
      const userId = req.user.userId;
      const { deliveryAddress } = req.body;
      const cartItems = await pool.query(OrderQueries.GET_CART, [userId]);

      if (!cartItems.rows.length) {
        return res.status(400).json({ message: "Корзина пуста" });
      }

      const estimatedDeliveryDate = moment().add(5, "days").toISOString();

      const orderResult = await pool.query(OrderQueries.createOrder, [
        userId,
        deliveryAddress,
        estimatedDeliveryDate,
        "registered",
      ]);
      const order = orderResult.rows[0];

      for (const item of cartItems.rows) {
        await pool.query(OrderQueries.createOrderItem, [
          order.id,
          item.product_id,
          item.seller_id,
          item.quantity,
          item.price,
        ]);

        await NotificationController.createNotification({
          userId: item.seller_id,
          message: `Новый заказ на товар: ${item.name}`,
        });
      }

      await pool.query(OrderQueries.clearCart, [userId]);

      await NotificationController.createNotification({
        userId,
        message: `Ваш заказ №${order.id} успешно создан.`,
      });

      res.status(201).json(order);
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      res.status(500).json({ message: "Ошибка создания заказа", error });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { orderId, productId, status, cancelReason } = req.body;
      const userId = req.user.userId;
      const userRole = req.user.role;

      const orderItemResult = await pool.query(
        `SELECT oi.status, p.user_id AS seller_id 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1 AND oi.product_id = $2`,
        [orderId, productId]
      );

      if (!orderItemResult.rows.length) {
        return res.status(404).json({ message: "Товар в заказе не найден" });
      }

      const currentStatus = orderItemResult.rows[0].status;
      const sellerId = orderItemResult.rows[0].seller_id;

      const cancelStatuses = {
        seller: "cancelled_by_seller",
        buyer: "cancelled_by_buyer",
      };

      const updateFields = ["status = $1"];
      const updateValues = [status];

      if (cancelReason) {
        updateFields.push("cancel_reason = $2");
        updateValues.push(cancelReason);
      }

      const query = `
        UPDATE order_items 
        SET ${updateFields.join(", ")}
        WHERE order_id = ${cancelReason ? "$3" : "$2"} 
          AND product_id = ${cancelReason ? "$4" : "$3"}
        RETURNING *
      `;

      const queryParams = cancelReason
        ? [...updateValues, orderId, productId]
        : [...updateValues, orderId, productId];

      const updatedResult = await pool.query(query, queryParams);

      await pool.query(`UPDATE orders SET updated_at = NOW() WHERE id = $1`, [
        orderId,
      ]);

      const notificationMessage = status.includes("cancelled")
        ? `Заказ №${orderId} отменен (${
            status === cancelStatuses.seller ? "продавцом" : "покупателем"
          })`
        : `Статус товара в заказе №${orderId} изменен на: ${status}`;

      await NotificationController.createNotification({
        userId: status.includes("cancelled")
          ? status === cancelStatuses.seller
            ? updatedResult.rows[0].user_id
            : sellerId
          : updatedResult.rows[0].user_id,
        message: notificationMessage,
      });

      res.json({
        success: true,
        message: "Статус заказа успешно обновлен",
        updatedItem: updatedResult.rows[0],
      });
    } catch (error) {
      console.error("Ошибка обновления статуса заказа:", error);
      res.status(500).json({
        message: "Ошибка обновления статуса заказа",
        error: error.message,
      });
    }
  }
  static async getOrder(req, res) {
    try {
      const userId = req.user.userId;
      const orderId = req.params.id;

      const orderResult = await pool.query(OrderQueries.getOrderByIdAndUser, [
        orderId,
        userId,
      ]);

      if (!orderResult.rows.length) {
        return res.status(404).json({ message: "Заказ не найден" });
      }

      const order = orderResult.rows[0];

      const orderItemsResult = await pool.query(OrderQueries.getOrderItems, [
        orderId,
      ]);

      const orderItems = orderItemsResult.rows;

      res.json({ order, items: orderItems });
    } catch (error) {
      console.error("Ошибка при получении заказа:", error);
      res.status(500).json({ message: "Ошибка при получении заказа", error });
    }
  }
  static async getOrdersByBuyer(req, res) {
    try {
      const userId = req.user.userId;

      const ordersResult = await pool.query(OrderQueries.GET_ORDERS_BY_BUYER, [
        userId,
      ]);
      console.log("User ID (Buyer):", userId);
      res.json(ordersResult.rows);
    } catch (error) {
      console.error("Ошибка при получении заказов покупателя:", error);
      res.status(500).json({ message: "Ошибка при получении заказов", error });
    }
  }

  static async getOrdersBySeller(req, res) {
    try {
      const userId = req.user.userId;

      const ordersResult = await pool.query(OrderQueries.GET_ORDERS_BY_SELLER, [
        userId,
      ]);

      res.json(ordersResult.rows);
    } catch (error) {
      console.error("Ошибка при получении заказов продавца:", error);
      res.status(500).json({ message: "Ошибка при получении заказов", error });
    }
  }
}

module.exports = OrderController;
