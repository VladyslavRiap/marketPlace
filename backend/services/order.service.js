const pool = require("../config/db");
const OrderQueries = require("../queries/order.queries");
const moment = require("moment");

class OrderService {
  static async getCart(userId) {
    const result = await pool.query(OrderQueries.GET_CART, [userId]);
    return result.rows;
  }

  static async createOrder(
    userId,
    deliveryAddress,
    phone,
    firstName,
    lastName,
    city,
    region
  ) {
    const estimatedDeliveryDate = moment().add(5, "days").toISOString();
    const result = await pool.query(OrderQueries.createOrder, [
      userId,
      deliveryAddress,
      estimatedDeliveryDate,
      "registered",
      phone,
      firstName,
      lastName,
      city,
      region,
    ]);
    return result.rows[0];
  }

  static async createOrderItem(orderId, productId, sellerId, quantity, price) {
    await pool.query(
      "UPDATE products SET purchase_count = purchase_count + 1 WHERE id = $1",
      [productId]
    );
    await pool.query(OrderQueries.createOrderItem, [
      orderId,
      productId,
      sellerId,
      quantity,
      price,
    ]);
  }

  static async clearCart(userId) {
    await pool.query(OrderQueries.clearCart, [userId]);
  }

  static async getOrderItem(orderId, productId) {
    const result = await pool.query(
      `SELECT oi.status, p.user_id AS seller_id 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1 AND oi.product_id = $2`,
      [orderId, productId]
    );
    return result.rows[0];
  }

  static async updateOrderItemStatus(orderId, productId, status, cancelReason) {
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

    const result = await pool.query(query, queryParams);
    return result.rows[0];
  }

  static async updateOrderTimestamp(orderId) {
    await pool.query(`UPDATE orders SET updated_at = NOW() WHERE id = $1`, [
      orderId,
    ]);
  }

  static async getOrderByIdAndUser(orderId, userId) {
    const result = await pool.query(OrderQueries.getOrderByIdAndUser, [
      orderId,
      userId,
    ]);
    return result.rows[0];
  }

  static async getOrderItems(orderId) {
    const result = await pool.query(OrderQueries.getOrderItems, [orderId]);
    return result.rows;
  }

  static async getOrdersByBuyer(userId) {
    const result = await pool.query(OrderQueries.GET_ORDERS_BY_BUYER, [userId]);
    return result.rows;
  }

  static async getOrdersBySeller(userId) {
    const result = await pool.query(OrderQueries.GET_ORDERS_BY_SELLER, [
      userId,
    ]);
    return result.rows;
  }
}

module.exports = OrderService;
