const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Управление заказами
 */
/**
 * @swagger
 * /api/orders/buyer:
 *   get:
 *     summary: Получить заказы покупателя
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список заказов покупателя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Ошибка сервера
 */
router.get("/buyer", authMiddleware, OrderController.getOrdersByBuyer);

/**
 * @swagger
 * /api/orders/seller:
 *   get:
 *     summary: Получить заказы продавца
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список заказов продавца
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Ошибка сервера
 */
router.get("/seller", authMiddleware, OrderController.getOrdersBySeller);
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Создать новый заказ
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryAddress
 *             properties:
 *               deliveryAddress:
 *                 type: string
 *                 description: Адрес доставки
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Корзина пуста
 *       500:
 *         description: Ошибка сервера
 */
router.post("/", authMiddleware, OrderController.createOrder);

/**
 * @swagger
 * /api/orders/status:
 *   put:
 *     summary: Обновить статус заказа
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - productId
 *               - status
 *             properties:
 *               orderId:
 *                 type: integer
 *                 description: ID заказа
 *               productId:
 *                 type: integer
 *                 description: ID товара
 *               status:
 *                 type: string
 *                 enum: [registered, paid, ready_for_delivery, shipped, in_transit, delivered, completed]
 *                 description: Новый статус заказа
 *     responses:
 *       200:
 *         description: Статус заказа успешно обновлен
 *       403:
 *         description: Нет прав для изменения статуса
 *       404:
 *         description: Заказ не найден
 *       500:
 *         description: Ошибка сервера
 */
router.put("/status", authMiddleware, OrderController.updateOrderStatus);
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Получить информацию о заказе
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Информация о заказе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Заказ не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get("/:id", authMiddleware, OrderController.getOrder);

module.exports = router;
