const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const usersRoutes = require("./routes/users.routes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");
const notificationRoutes = require("./routes/notification.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const orderRoutes = require("./routes/order.routes");
const recommendationRoutes = require("./routes/recommendation.routes");
const cookieParser = require("cookie-parser");
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/error.middleware");
const app = express();
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Marketplace API is running",
    documentation: "/api/docs",
  });
});
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://market-place-pl7afnwv1-vladyslavriaps-projects.vercel.app/",
      "http://localhost:3000",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api", reviewRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - ${JSON.stringify(req.body)}`);
  next();
});
app.use(notFoundHandler);

app.use(errorHandler);
module.exports = app;
