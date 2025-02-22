const pool = require("../config/db");

exports.addReview = async (req, res) => {
  const { userId } = req.user;
  const { productId, rating, comment } = req.body;

  if (!productId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, product_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, productId, rating, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding review:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProductReviews = async (req, res) => {
  const { id: productId } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.email AS user_email
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1`,
      [productId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateReview = async (req, res) => {
  const { userId, role } = req.user;
  const { id: reviewId } = req.params;
  const { rating, comment } = req.body;

  if (!rating && !comment) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  try {
    const reviewResult = await pool.query(
      "SELECT user_id FROM reviews WHERE id = $1",
      [reviewId]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    const reviewUserId = reviewResult.rows[0].user_id;

    if (reviewUserId !== userId && role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this review" });
    }

    const result = await pool.query(
      `UPDATE reviews
       SET rating = COALESCE($1, rating),
           comment = COALESCE($2, comment),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [rating, comment, reviewId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating review:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteReview = async (req, res) => {
  const { userId, role } = req.user;
  const { id: reviewId } = req.params;

  try {
    const reviewResult = await pool.query(
      "SELECT user_id FROM reviews WHERE id = $1",
      [reviewId]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    const reviewUserId = reviewResult.rows[0].user_id;

    if (reviewUserId !== userId && role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this review" });
    }

    await pool.query("DELETE FROM reviews WHERE id = $1", [reviewId]);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
