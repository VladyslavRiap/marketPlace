const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const queries = require("../queries/auth.queries");
const ERROR_MESSAGES = require("../constants/messageErrors");

class AuthService {
  static async findByEmail(email) {
    const result = await pool.query(queries.GET_EMAIL_USER, [email]);
    return result.rows[0];
  }

  static async createUser(name, email, hashedPassword, role) {
    const result = await pool.query(queries.SIGN_USER, [
      name,
      email,
      hashedPassword,
      role,
    ]);
    return result.rows[0];
  }

  static async saveRefreshToken(userId, refreshToken) {
    await pool.query(queries.REFRESH_TOKEN, [userId, refreshToken]);
  }

  static async getRefreshToken(refreshToken) {
    const result = await pool.query(queries.GET_REFRESH_TOKEN, [refreshToken]);
    return result.rows[0];
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

module.exports = AuthService;
