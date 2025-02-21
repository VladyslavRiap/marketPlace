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
 * /api/products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query (name, description, category, etc.)
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
 *     responses:
 *       200:
 *         description: List of products matching the search query
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
router.get("/search", productController.searchProducts);
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:id", productController.getProductById);

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
router.post(
  "/",
  authMiddleware,
  checkRole(["admin", "seller"]),
  productController.addProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nike Air Max"
 *               price:
 *                 type: number
 *                 example: 199.99
 *               category:
 *                 type: string
 *                 example: "Fashion"
 *               description:
 *                 type: string
 *                 example: "Comfortable running shoes"
 *               image_url:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Product successfully updated
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  authMiddleware,
  checkRole(["admin", "seller"]),
  productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  authMiddleware,
  checkRole(["admin", "seller"]),
  productController.deleteProduct
);

module.exports = router;
