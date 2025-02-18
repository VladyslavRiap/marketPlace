const pool = require("../config/db");

exports.createUser = async (email, hashedPassword) => {
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      throw new Error("User with this email already exists");
    }

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error while creating user:", error.message);
    throw error;
  }
};

exports.findByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error while finding user:", error.message);
    throw error;
  }
};
