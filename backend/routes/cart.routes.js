const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: List of items in the cart
 */
router.get("/", authMiddleware, cartController.getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Product added to the cart
 */
router.post("/", authMiddleware, cartController.addToCart);
/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete("/clear", authMiddleware, cartController.clearCart);
/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product removed from the cart
 */
router.delete("/:id", authMiddleware, cartController.removeFromCart);

/**
 * @swagger
 * /api/cart/update:
 *   post:
 *     summary: Update product quantity in the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantityChange
 *             properties:
 *               productId:
 *                 type: integer
 *               quantityChange:
 *                 type: integer
 *                 enum: [1, -1]
 *                 description: Change in quantity (1 — add, -1 — remove)
 *     responses:
 *       200:
 *         description: Product quantity updated
 *       400:
 *         description: Invalid quantity
 *       404:
 *         description: Product not found in the cart
 */
router.post("/update", authMiddleware, cartController.updateQuantityInCart);

module.exports = router;
