const UserModel = require("../models/UserModel");
const uploadFile = require("../services/s3");
class UserController {
  static async getCurrentUser(req, res) {
    try {
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
  static async updateAvatar(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: "Файл не загружен" });
    }

    try {
      const folder = "avatars";
      const uploadedImageUrl = await uploadFile(
        "marketplace-my-1-2-3-4",
        req.file.originalname,
        req.file.buffer
      );

      await UserModel.updateUserAvatar(req.user.userId, uploadedImageUrl);
      res.json({ avatarUrl: uploadedImageUrl });
    } catch (error) {
      console.error("Ошибка загрузки аватара:", error);
      res.status(500).json({ error: "Ошибка загрузки аватара" });
    }
  }

  static async updateMobileNumber(req, res) {
    const { mobnumber } = req.body;

    if (!mobnumber) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    try {
      const updatedUser = await UserModel.updateUserMobNumber(
        req.user.userId,
        mobnumber
      );
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating mobile number:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
  static async updateUserProfile(req, res) {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    try {
      const updatedUser = await UserModel.updateUserName(req.user.userId, name);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;

    try {
      const result = await UserModel.updatePassword(
        req.user.userId,
        oldPassword,
        newPassword
      );
      res.json(result);
    } catch (error) {
      console.error("Error changing password:", error.message);
      res.status(400).json({ error: error.message });
    }
  }

  static async register(req, res) {
    const { email, password, role = "buyer" } = req.body;

    try {
      const user = await UserModel.createUser(email, password, role);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error during registration:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UserController;
