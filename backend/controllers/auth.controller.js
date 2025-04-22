const jwt = require("jsonwebtoken");
const AuthService = require("../services/auth.service");
const ERROR_MESSAGES = require("../constants/messageErrors");

const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "7d";

class AuthController {
  static async register(req, res, next) {
    const { name, email, password, role } = req.body;

    try {
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      const existingUser = await AuthService.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
      }

      const hashedPassword = await AuthService.hashPassword(password);
      const user = await AuthService.createUser(
        name,
        email,
        hashedPassword,
        role
      );

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
      );
      const refreshToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES }
      );

      await AuthService.saveRefreshToken(user.id, refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain:
          process.env.NODE_ENV === "production" ? ".railway.app" : undefined,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain:
          process.env.NODE_ENV === "production" ? ".railway.app" : undefined,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: ERROR_MESSAGES.EMAIL_PASSWORD_REQUIRED });
      }

      const user = await AuthService.findByEmail(email);
      if (
        !user ||
        !(await AuthService.verifyPassword(password, user.password))
      ) {
        return res
          .status(401)
          .json({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });
      }
      if (user.is_blocked) {
        return res.status(403).json({ error: ERROR_MESSAGES.ACCOUNT_BLOCKED });
      }

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
      );
      const refreshToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES }
      );

      await AuthService.saveRefreshToken(user.id, refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain:
          process.env.NODE_ENV === "production" ? ".railway.app" : undefined,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain:
          process.env.NODE_ENV === "production" ? ".railway.app" : undefined,
        maxAge: 15 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production" ? ".railway.app" : undefined,
      maxAge: 15 * 60 * 1000,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production" ? ".railway.app" : undefined,
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: ERROR_MESSAGES.LOGOUT_SUCCESS });
  }

  static async refreshToken(req, res, next) {
    const { refreshToken } = req.cookies;

    try {
      if (!refreshToken) {
        return res
          .status(401)
          .json({ error: ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED });
      }

      const tokenExists = await AuthService.getRefreshToken(refreshToken);
      if (!tokenExists) {
        return res
          .status(403)
          .json({ error: ERROR_MESSAGES.INVALID_REFRESH_TOKEN });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const newAccessToken = jwt.sign(
        { userId: decoded.userId, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain:
          process.env.NODE_ENV === "production" ? ".railway.app" : undefined,
        maxAge: 15 * 60 * 1000,
      });

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res
        .status(403)
        .json({ error: ERROR_MESSAGES.INVALID_REFRESH_TOKEN });
    }
  }
}

module.exports = AuthController;
