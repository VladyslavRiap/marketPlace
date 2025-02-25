const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findByEmail } = require("../models/UserModel");
const queries = require("../queries/auth.queries");
const ACCESS_TOKEN_EXPIRES = "24h";
const REFRESH_TOKEN_EXPIRES = "30d";
class AuthController {
  static async register(req, res) {
    const { email, password, role = "buyer" } = req.body;

    try {
      const existingUser = await pool.query(queries.GET_EMAIL_USER, [email]);
      if (existingUser.rows.length > 0) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(queries.SIGN_USER, [
        email,
        hashedPassword,
        role,
      ]);

      const user = result.rows[0];

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES }
      );

      await pool.query(queries.REFRESH_TOKEN, [user.id, refreshToken]);

      res.json({ accessToken, refreshToken, user });
    } catch (error) {
      console.error("Register error:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const user = await findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (user.is_blocked) {
        return res.status(403).json({ error: "Your account is blocked" });
      }

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES }
      );

      await pool.query(queries.REFRESH_TOKEN, [user.id, refreshToken]);

      res.json({ accessToken, refreshToken });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ error: "Login error: " + error.message });
    }
  }

  static async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    try {
      const tokenExists = await pool.query(queries.GET_REFRESH_TOKEN, [
        refreshToken,
      ]);

      if (tokenExists.rows.length === 0) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
      );

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
  }

  static async logout(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    try {
      const tokenExists = await pool.query(queries.GET_REFRESH_TOKEN, [
        refreshToken,
      ]);

      if (tokenExists.rows.length === 0) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      await pool.query(queries.DELETE_REFRESH_TOKEN, [refreshToken]);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ error: "Logout error" });
    }
  }
}

module.exports = AuthController;
