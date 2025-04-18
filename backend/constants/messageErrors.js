module.exports = {
  // Общие ошибки

  SERVER_ERROR: "Server error",
  NOT_FOUND: "Not found",
  VALIDATION_ERROR: "Validation error",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden access",
  FILE_NOT_UPLOADED: "File not uploaded",
  INVALID_USER_ID: "Invalid user ID",
  POSITION_REQUIRED: "Position parameter is required",
  ADS_NOT_FOUND: "Ads for this position not found",
  // Ошибки аутентификации
  EMAIL_ALREADY_EXISTS: "User with this email already exists",
  REGISTRATION_FAILED: "Registration failed",
  EMAIL_PASSWORD_REQUIRED: "Email and password are required",
  INVALID_CREDENTIALS: "Invalid credentials",
  ACCOUNT_BLOCKED: "Account is blocked",
  LOGIN_ERROR: "Login error",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_REFRESH_TOKEN: "Invalid refresh token",
  LOGOUT_SUCCESS: "Logged out successfully",

  INVALID_PASSWORD: "Invalid password",
  PASSWORD_UPDATED: "Password update sucsess",
  MOBILE_NUMBER_REQUIRED: "Mobile number is required",
  NAME_REQUIRED: "User name is required",
  // Ошибки пользователей
  USER_NOT_FOUND: "User not found",
  USER_BLOCKED: "User blocked successfully",
  USER_UNBLOCKED: "User unblocked successfully",
  MOBILE_NUMBER_REQUIRED: "Mobile number is required",
  NAME_REQUIRED: "Name is required",

  // Ошибки продуктов
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_ID_REQUIRED: "Product ID is required",
  PRODUCT_REQUIRED_FIELDS: "Name, price, and subcategory are required",
  PRODUCT_ATTRIBUTES_REQUIRED: "Product ID and attributes are required",
  ATTRIBUTE_NOT_FOUND: (id) => `Attribute with ID ${id} does not exist`,
  ATTRIBUTES_ADDED: "Attributes added successfully",
  UNAUTHORIZED_PRODUCT_UPDATE: "Not authorized to update this product",
  UNAUTHORIZED_PRODUCT_DELETE: "Not authorized to delete this product",
  PRODUCT_DELETED: "Product deleted successfully",

  // Ошибки корзины
  CART_ITEM_NOT_FOUND: "Item not found in cart",
  CART_ITEM_DELETED: "Item removed from cart successfully",
  CART_CLEARED: "Cart cleared successfully",
  CART_MIN_QUANTITY: "Item quantity cannot be less than 1",
  CART_INVALID_QUANTITY_CHANGE: "Quantity change must be +1 or -1",
  CART_EMPTY: "Cart is empty",

  // Ошибки заказов
  ORDER_NOT_FOUND: "Order not found",
  ORDER_REQUIRED_FIELDS:
    "Phone, first name, last name, city, and region are required",
  ORDER_ITEM_NOT_FOUND: "Order item not found",
  ORDER_STATUS_UPDATED: "Order status updated successfully",

  // Ошибки избранного
  FAVORITE_EXISTS: "Product already in favorites",
  FAVORITE_NOT_FOUND: "Favorite not found",
  FAVORITE_REMOVED: "Product removed from favorites",

  // Ошибки уведомлений
  NOTIFICATION_NOT_FOUND: "Notification not found",
  NOTIFICATION_MARKED_READ: "Notification marked as read",
  NOTIFICATION_DELETED: "Notification deleted successfully",

  // Ошибки объявлений
  AD_NOT_FOUND: "Ad not found",
  AD_DELETED: "Ad deleted successfully",

  // Ошибки загрузки файлов
  NO_IMAGES_UPLOADED: "No images were uploaded",
  INVALID_FILE_TYPE: "Only image files are allowed",

  // Ошибки отзывов
  INVALID_RATING: "Rating must be between 0 and 5",
  REVIEW_ADDED: "Review added and rating updated",
  REVIEW_NOT_FOUND: "Review not found",
  REVIEW_DELETED: "Review deleted successfully",
  NOTHING_TO_UPDATE: "Nothing to update",
  UNAUTHORIZED_REVIEW_UPDATE: "Not authorized to update this review",
  UNAUTHORIZED_REVIEW_DELETE: "Not authorized to delete this review",

  CATEGORY_ID_REQUIRED: "Category ID is required",
  NO_PERSONALIZED_DATA:
    "No personalized data available, showing popular products",
  COLORS_REQUIRED: "At least one color is required",
  SIZES_REQUIRED: "At least one size is required",
  COLOR_NOT_FOUND: (id) => `Color with id ${id} not found`,
  SIZE_NOT_FOUND: (id) => `Size with id ${id} not found`,
  COLORS_ADDED: "Colors added successfully",
  SIZES_ADDED: "Sizes added successfully",
};
