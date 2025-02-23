const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favorite.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add a product to favorites
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
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
 *       201:
 *         description: Product added to favorites
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, favoriteController.addToFavorites);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get list of favorite products
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image_url:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, favoriteController.getFavorites);

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Remove a product from favorites
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the favorite item
 *     responses:
 *       200:
 *         description: Product removed from favorites
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, favoriteController.removeFromFavorites);

module.exports = router;
