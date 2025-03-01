const express = require("express");
const {
  getCurrentUser,
  updateUserProfile,
  changePassword,
  updateMobileNumber,
  updateAvatar,
} = require("../controllers/users.controller");
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
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
});
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
router.put("/me/avatar", authMiddleware, upload.single("avatar"), updateAvatar);
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
 * /api/users/me/update-mobnumber:
 *   put:
 *     summary: Change user mobNumber
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
 *               newNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Number changed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/me/update-mobnumber", authMiddleware, updateMobileNumber);

module.exports = router;
