const express = require("express");
const {
  getCurrentUser,
  updateUserProfile,
  changePassword,
  getAllUsers,
  blockUser,
  unblockUser,
} = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/role.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user data
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, getCurrentUser);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/me", authMiddleware, updateUserProfile);

/**
 * @swagger
 * /api/users/me/password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/me/password", authMiddleware, changePassword);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get("/", authMiddleware, checkRole(["admin"]), getAllUsers);

/**
 * @swagger
 * /api/users/{id}/block:
 *   put:
 *     summary: Block a user (Admin only)
 *     tags: [Users]
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
router.put("/:id/block", authMiddleware, checkRole(["admin"]), blockUser);

/**
 * @swagger
 * /api/users/{id}/unblock:
 *   put:
 *     summary: Unblock a user (Admin only)
 *     tags: [Users]
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
router.put("/:id/unblock", authMiddleware, checkRole(["admin"]), unblockUser);

module.exports = router;
