const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const queries = require("../queries/users.queries");
const ERROR_MESSAGES = require("../constants/messageErrors");

class UserService {
  static async findById(userId) {
    const result = await pool.query(queries.GET_USER_BY_ID, [userId]);
    if (!result.rows[0]) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(queries.GET_USER_BY_EMAIL, [email]);
    return result.rows[0] || null;
  }

  static async updateAvatar(userId, avatarUrl) {
    const result = await pool.query(queries.UPDATE_USER_AVATAR, [
      avatarUrl,
      userId,
    ]);
    return result.rows[0];
  }

  static async createUser(email, password, role = "buyer") {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(queries.CREATE_USER, [
      email,
      hashedPassword,
      role,
    ]);
    return result.rows[0];
  }

  static async updateName(userId, name) {
    const result = await pool.query(queries.UPDATE_USER_NAME, [name, userId]);
    return result.rows[0];
  }

  static async updateMobileNumber(userId, mobnumber) {
    const result = await pool.query(queries.UPDATE_USER_MOBNUMBER, [
      mobnumber,
      userId,
    ]);
    return result.rows[0];
  }

  static async changePassword(userId, oldPassword, newPassword) {
    const user = await pool.query(queries.GET_USER_PASSWORD, [userId]);
    if (!user.rows.length) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
    if (!isMatch) {
      throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(queries.UPDATE_USER_PASSWORD, [hashedPassword, userId]);

    return { message: ERROR_MESSAGES.PASSWORD_UPDATED };
  }
}

module.exports = UserService;
