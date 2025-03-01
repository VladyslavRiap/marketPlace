const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const queries = require("../queries/users.queries");

class UserModel {
  static async findById(userId) {
    const result = await pool.query(queries.GET_USER_BY_ID, [userId]);
    return result.rows[0] || null;
  }

  static async findByEmail(email) {
    const result = await pool.query(queries.GET_USER_BY_EMAIL, [email]);
    return result.rows[0] || null;
  }

  static async updateUserAvatar(userId, avatarUrl) {
    const result = await pool.query(queries.UPDATE_USER_AVATAR, [
      avatarUrl,
      userId,
    ]);
    return result.rows[0];
  }

  static async createUser(email, password, role = "buyer") {
    const existingUser = await pool.query(queries.GET_USER_BY_EMAIL, [email]);

    if (existingUser.rows.length > 0) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(queries.CREATE_USER, [
      email,
      hashedPassword,
      role,
    ]);

    return result.rows[0];
  }

  static async updateUserName(userId, name) {
    const result = await pool.query(queries.UPDATE_USER_NAME, [name, userId]);
    return result.rows[0];
  }

  static async updateUserMobNumber(userId, mobnumber) {
    const result = await pool.query(queries.UPDATE_USER_MOBNUMBER, [
      mobnumber,
      userId,
    ]);

    return { message: "Password updated successfully" };
  }

  static async updatePassword(userId, oldPassword, newPassword) {
    const user = await pool.query(queries.GET_USER_PASSWORD, [userId]);

    if (!user.rows.length) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(queries.UPDATE_USER_PASSWORD, [hashedPassword, userId]);

    return { message: "Password updated successfully" };
  }
}

module.exports = UserModel;
