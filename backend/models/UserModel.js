const pool = require("../config/db");

const createUser = async (email, hashedPassword, role = "buyer") => {
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      throw new Error("User with this email already exists");
    }

    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, role]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error while creating user:", error.message);
    throw error;
  }
};

const findByEmail = async (email) => {
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

module.exports = { createUser, findByEmail };
