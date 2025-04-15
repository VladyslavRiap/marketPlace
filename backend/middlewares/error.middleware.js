const ERROR_MESSAGES = require("../constants/messageErrors");

function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: ERROR_MESSAGES.VALIDATION_ERROR,
      details: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: ERROR_MESSAGES.UNAUTHORIZED,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: ERROR_MESSAGES.UNAUTHORIZED,
      message: "Token expired",
    });
  }

  res.status(500).json({
    error: ERROR_MESSAGES.SERVER_ERROR,
    message: err.message,
  });
}

function notFoundHandler(req, res, next) {
  res.status(404).json({ error: ERROR_MESSAGES.NOT_FOUND });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
