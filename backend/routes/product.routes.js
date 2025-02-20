const express = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/role.middleware");
const router = express.Router();
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get the list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page (default is 10)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of products
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
 *       500:
 *         description: Server error
 */

router.get("/", productController.getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nike Air Max"
 *               price:
 *                 type: number
 *                 example: 199.99
 *               category:
 *                 type: string
 *                 enum:
 *                   - "Phones, tablets and laptops"
 *                   - "Computers and peripheral devices"
 *                   - "TV, audio and photo"
 *                   - "Game"
 *                   - "Large electrical appliances"
 *                   - "Small electrical appliances"
 *                   - "Fashion"
 *                   - "Health and Beauty"
 *                   - "Home, Garden and Pet Shop"
 *                   - "Toys and children’s products"
 *                   - "Sports and Leisure"
 *                   - "Auto and DIY"
 *                   - "Books, office and food"
 *                 example: "Fashion"
 *               description:
 *                 type: string
 *                 example: "Comfortable running shoes"
 *               image_url:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Product successfully added
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */
router.post("/", productController.addProduct);

module.exports = router;
