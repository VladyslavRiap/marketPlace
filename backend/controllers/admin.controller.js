const AdminService = require("../services/admin.service");
const uploadFile = require("../services/s3");
const ERROR_MESSAGES = require("../constants/messageErrors");
class AdminController {
  static async getStats(req, res, next) {
    try {
      const stats = await AdminService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    const { id } = req.params;
    const { name, price, category, description, image_url } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ error: ERROR_MESSAGES.PRODUCT_REQUIRED_FIELDS });
    }

    try {
      const product = await AdminService.updateProduct(id, {
        name,
        price,
        category,
        description,
        image_url,
      });

      if (!product) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    const { id } = req.params;

    try {
      const rowCount = await AdminService.deleteProduct(id);

      if (rowCount === 0) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
      }

      res.status(200).json({ message: ERROR_MESSAGES.PRODUCT_DELETED });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await AdminService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async blockUser(req, res, next) {
    try {
      await AdminService.blockUser(req.params.id);
      res.json({ message: ERROR_MESSAGES.USER_BLOCKED });
    } catch (error) {
      next(error);
    }
  }

  static async unblockUser(req, res, next) {
    try {
      await AdminService.unblockUser(req.params.id);
      res.json({ message: ERROR_MESSAGES.USER_UNBLOCKED });
    } catch (error) {
      next(error);
    }
  }

  static async addAd(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: ERROR_MESSAGES.VALIDATION_ERROR,
          message: ERROR_MESSAGES.NO_IMAGE_UPLOADED,
        });
      }

      // Upload the single image
      const imageUrl = await uploadFile(
        "marketplace-my-1-2-3-4",
        req.file.originalname,
        req.file.buffer
      );

      const ad = await AdminService.addAd({
        imageUrl: imageUrl,
        position: req.body.position,
        linkUrl: req.body.link_url,
        title: req.body.title,
      });

      res.status(201).json(ad);
    } catch (error) {
      next(error);
    }
  }
  static async getAdsByPosition(req, res, next) {
    try {
      const ads = await AdminService.getAdsByPosition(req.params.position);
      res.json(ads);
    } catch (error) {
      next(error);
    }
  }
  static async deleteAd(req, res, next) {
    const { id } = req.params;

    try {
      const rowCount = await AdminService.deleteAd(id);

      if (rowCount === 0) {
        return res.status(404).json({ error: ERROR_MESSAGES.AD_NOT_FOUND });
      }

      res.status(200).json({ message: ERROR_MESSAGES.AD_DELETED });
    } catch (error) {
      next(error);
    }
  }

  static async getAdsByPosition(req, res, next) {
    try {
      const { position } = req.query; // Получаем позицию из query параметров
      if (!position) {
        return res.status(400).json({
          error: ERROR_MESSAGES.VALIDATION_ERROR,
          message: ERROR_MESSAGES.POSITION_REQUIRED,
        });
      }

      const ads = await AdminService.getAdsByPosition(position);
      res.json(ads);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
