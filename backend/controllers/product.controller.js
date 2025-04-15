const ProductService = require("../services/product.service");
const uploadFile = require("../services/s3");
const ERROR_MESSAGES = require("../constants/messageErrors");
const queries = require("../queries/product.queries");
const RecommendationService = require("../services/recommendation.service");
class ProductController {
  static fabricGetMethod(baseQuery, hasFilters = false) {
    return async (req, res, next) => {
      try {
        const result = await ProductService.getProducts(
          req.query,
          baseQuery,
          hasFilters
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    };
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      await ProductService.incrementViewCount(id);
      const product = await ProductService.getProductById(id);

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

  static async addProduct(req, res, next) {
    try {
      const { name, price, description, subcategory_id } = req.body;
      const userId = req.user.userId;

      if (!name || !price || !subcategory_id) {
        return res.status(400).json({
          error: ERROR_MESSAGES.PRODUCT_REQUIRED_FIELDS,
        });
      }

      const product = await ProductService.addProduct(
        name,
        price,
        description,
        subcategory_id,
        userId
      );

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const imageUrl = await uploadFile(
            "marketplace-my-1-2-3-4",
            file.originalname,
            file.buffer
          );
          await ProductService.addProductImage(product.id, imageUrl);
        }
      }

      res.status(201).json({ id: product.id });
    } catch (error) {
      next(error);
    }
  }

  static async addProductAttributes(req, res, next) {
    try {
      const { productId } = req.params;
      const { attributes } = req.body;

      if (!productId || !attributes || attributes.length === 0) {
        return res.status(400).json({
          error: ERROR_MESSAGES.PRODUCT_ATTRIBUTES_REQUIRED,
        });
      }

      const productExists = await ProductService.checkProductExistence(
        productId
      );
      if (!productExists) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
      }

      for (const attr of attributes) {
        const attributeExists = await ProductService.checkAttributeExistence(
          attr.attribute_id
        );
        if (!attributeExists) {
          return res.status(400).json({
            error: ERROR_MESSAGES.ATTRIBUTE_NOT_FOUND(attr.attribute_id),
          });
        }
      }

      await ProductService.addProductAttributes(productId, attributes);
      res.status(200).json({ message: ERROR_MESSAGES.ATTRIBUTES_ADDED });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price, description, subcategory_id, attributes } = req.body;
      const userId = req.user.userId;

      if (!name || !price || !subcategory_id) {
        return res.status(400).json({
          error: ERROR_MESSAGES.PRODUCT_REQUIRED_FIELDS,
        });
      }

      const product = await ProductService.checkProductOwner(id);
      if (!product) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
      }

      if (product.user_id !== userId && req.user.role !== "admin") {
        return res.status(403).json({
          error: ERROR_MESSAGES.UNAUTHORIZED_PRODUCT_UPDATE,
        });
      }

      const updatedFields = {
        name,
        price,
        description,
      };

      const updatedProduct = await ProductService.updateProduct(
        id,
        updatedFields
      );

      if (req.files && req.files.length > 0) {
        await ProductService.deleteProductImages(id);
        for (const file of req.files) {
          const imageUrl = await uploadFile(
            "marketplace-my-1-2-3-4",
            file.originalname,
            file.buffer
          );
          await ProductService.addProductImage(id, imageUrl);
        }
      }

      await ProductService.deleteProductAttributes(id);
      if (attributes && attributes.length > 0) {
        await ProductService.addProductAttributes(id, attributes);
      }

      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const product = await ProductService.checkProductOwner(id);
      if (!product) {
        return res
          .status(404)
          .json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
      }

      if (product.user_id !== userId && req.user.role !== "admin") {
        return res.status(403).json({
          error: ERROR_MESSAGES.UNAUTHORIZED_PRODUCT_DELETE,
        });
      }

      await ProductService.deleteProductAttributes(id);
      await ProductService.deleteProduct(id);
      res.json({ message: ERROR_MESSAGES.PRODUCT_DELETED });
    } catch (error) {
      next(error);
    }
  }

  static async getSubcategoriesByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;
      const subcategories = await ProductService.getSubcategoriesByCategoryId(
        categoryId
      );
      res.json(subcategories);
    } catch (error) {
      next(error);
    }
  }

  static async getAttributesBySubcategoryId(req, res, next) {
    try {
      const { subcategoryId } = req.params;
      const attributes = await ProductService.getAttributesBySubcategoryId(
        subcategoryId
      );
      res.json(attributes);
    } catch (error) {
      next(error);
    }
  }

  static async searchProducts(req, res, next) {
    try {
      const { query, page, limit, sortBy, order } = req.query;
      const result = await ProductService.searchProducts(
        query,
        page,
        limit,
        sortBy,
        order
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getSellerProducts(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: ERROR_MESSAGES.INVALID_USER_ID });
      }

      const products = await ProductService.getSellerProducts(userId);
      res.json(products.length > 0 ? products : []);
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await ProductService.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async getSubCategories(req, res, next) {
    try {
      const subcategories = await ProductService.getSubCategories();
      res.json(subcategories);
    } catch (error) {
      next(error);
    }
  }
  static async getDiscountedProducts(req, res, next) {
    try {
      const products = await ProductService.getDiscountedProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getTopSellingProducts(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const products = await ProductService.getTopSellingProducts(limit);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getTrendingProducts(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const products = await ProductService.getTrendingProducts(limit);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
  static async getPersonalizedProducts(req, res, next) {
    try {
      const userId = req.user.userId;
      const { limit = 10 } = req.query;

      const products = await RecommendationService.getPersonalizedProducts(
        userId,
        limit
      );
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
}

ProductController.getProducts = ProductController.fabricGetMethod(
  queries.GET_PRODUCTS,
  true
);

ProductController.filterProducts = ProductController.fabricGetMethod(
  queries.GET_PRODUCTS,
  true
);

module.exports = ProductController;
