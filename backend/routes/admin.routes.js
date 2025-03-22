const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/role.middleware");
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
/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Statistics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 totalProducts:
 *                   type: integer
 *                 totalOrders:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get(
  "/stats",
  authMiddleware,
  checkRole(["admin"]),
  adminController.getStats
);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     summary: Update any product (admin only)
 *     tags: [Admin]
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
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put(
  "/products/:id",
  authMiddleware,
  checkRole(["admin"]),
  adminController.updateProduct
);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     summary: Delete any product (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/products/:id",
  authMiddleware,
  checkRole(["admin"]),
  adminController.deleteProduct
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get(
  "/users",
  authMiddleware,
  checkRole(["admin"]),
  adminController.getAllUsers
);

/**
 * @swagger
 * /api/admin/users/{id}/block:
 *   put:
 *     summary: Block a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User blocked successfully
 *       403:
 *         description: Forbidden
 */
router.put(
  "/users/:id/block",
  authMiddleware,
  checkRole(["admin"]),
  adminController.blockUser
);

/**
 * @swagger
 * /api/admin/users/{id}/unblock:
 *   put:
 *     summary: Unblock a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User unblocked successfully
 *       403:
 *         description: Forbidden
 */
router.put(
  "/users/:id/unblock",
  authMiddleware,
  checkRole(["admin"]),
  adminController.unblockUser
);
router.get("/ads", adminController.getAds);
router.post("/ads", upload, adminController.addAd);
router.delete("/ads/:id", adminController.deleteAd);
module.exports = router;
