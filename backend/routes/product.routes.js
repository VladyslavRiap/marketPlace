const express = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/role.middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
}).array("images", 5);

router.get("/mine", authMiddleware, productController.getSellerProducts);
router.get("/categories", productController.getCategories);
router.get("/subcategories", productController.getSubCategories);
router.post("/:productId/attributes", productController.addProductAttributes);
router.get("/discounted", productController.getDiscountedProducts);
router.get("/top-selling", productController.getTopSellingProducts);
router.get("/trending", productController.getTrendingProducts);
router.get("/colors", productController.getColors);
router.get("/sizes", productController.getSizes);

router.post(
  "/:productId/colors",
  authMiddleware,
  checkRole(["admin", "seller"]),
  productController.addProductColors
);
router.post(
  "/:productId/sizes",
  authMiddleware,
  checkRole(["admin", "seller"]),
  productController.addProductSizes
);
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
 *                   description:
 *                     type: string
 *                   image_url:
 *                     type: string
 *                   category:
 *                     type: string
 *                   subcategory:
 *                     type: string
 *                   attributes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         attribute_name:
 *                           type: string
 *                         attribute_value:
 *                           type: string
 *       500:
 *         description: Server error
 */
router.get("/", productController.getProducts);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products by keyword
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
 *                   description:
 *                     type: string
 *                   image_url:
 *                     type: string
 *                   category:
 *                     type: string
 *                   subcategory:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/search", productController.searchProducts);

/**
 * @swagger
 * /api/products/filter:
 *   get:
 *     summary: Filter products by category, price, rating, etc.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *         description: Filter by rating
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
 *         description: List of filtered products
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
 *                   description:
 *                     type: string
 *                   image_url:
 *                     type: string
 *                   category:
 *                     type: string
 *                   subcategory:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/filter", productController.filterProducts);

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
 *                 description:
 *                   type: string
 *                 image_url:
 *                   type: string
 *                 category:
 *                   type: string
 *                 subcategory:
 *                   type: string
 *                 attributes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       attribute_name:
 *                         type: string
 *                       attribute_value:
 *                         type: string
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
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - subcategory_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 13"
 *               price:
 *                 type: number
 *                 example: 999.99
 *               subcategory_id:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: "Latest smartphone from Apple"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     attribute_id:
 *                       type: integer
 *                     value:
 *                       type: string
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
  upload,
  productController.addProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 13 Pro"
 *               price:
 *                 type: number
 *                 example: 1099.99
 *               subcategory_id:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: "Latest smartphone from Apple"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     attribute_id:
 *                       type: integer
 *                     value:
 *                       type: string
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
  upload,
  productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
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

/**
 * @swagger
 * /api/products/categories/{categoryId}/subcategories:
 *   get:
 *     summary: Get subcategories by category ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: List of subcategories
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
 *       500:
 *         description: Server error
 */
router.get(
  "/categories/:categoryId/subcategories",
  productController.getSubcategoriesByCategoryId
);

/**
 * @swagger
 * /api/subcategories/{subcategoryId}/attributes:
 *   get:
 *     summary: Get attributes by subcategory ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: subcategoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the subcategory
 *     responses:
 *       200:
 *         description: List of attributes
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
 *                   type:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get(
  "/subcategories/:subcategoryId/attributes",
  productController.getAttributesBySubcategoryId
);

module.exports = router;
