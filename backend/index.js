const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Application ready on http://0.0.0.0:${PORT}`);
    });

    server.on("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("Database connection error", err);
    process.exit(1);
  });
