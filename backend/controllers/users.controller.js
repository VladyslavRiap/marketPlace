const UserService = require("../services/users.service");
const uploadFile = require("../services/s3");
const ERROR_MESSAGES = require("../constants/messageErrors");

class UserController {
  static async getCurrentUser(req, res, next) {
    try {
      const user = await UserService.findById(req.user.userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateAvatar(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: ERROR_MESSAGES.FILE_NOT_UPLOADED,
        });
      }

      const uploadedImageUrl = await uploadFile(
        "marketplace-my-1-2-3-4",
        req.file.originalname,
        req.file.buffer
      );

      await UserService.updateAvatar(req.user.userId, uploadedImageUrl);
      res.json({ avatarUrl: uploadedImageUrl });
    } catch (error) {
      next(error);
    }
  }

  static async updateMobileNumber(req, res, next) {
    const { mobnumber } = req.body;

    try {
      if (!mobnumber) {
        return res.status(400).json({
          error: ERROR_MESSAGES.MOBILE_NUMBER_REQUIRED,
        });
      }

      const updatedUser = await UserService.updateMobileNumber(
        req.user.userId,
        mobnumber
      );
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async updateUserProfile(req, res, next) {
    const { name } = req.body;

    try {
      if (!name) {
        return res.status(400).json({
          error: ERROR_MESSAGES.NAME_REQUIRED,
        });
      }

      const updatedUser = await UserService.updateName(req.user.userId, name);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    const { oldPassword, newPassword } = req.body;

    try {
      const result = await UserService.changePassword(
        req.user.userId,
        oldPassword,
        newPassword
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    const { email, password, role = "buyer" } = req.body;

    try {
      const user = await UserService.register(email, password, role);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
