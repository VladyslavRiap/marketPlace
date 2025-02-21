const pool = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, email, role,name FROM users WHERE id = $1",
      [req.user.userId]
    );
    if (!user.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const updatedUser = await pool.query(
      "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name, role",
      [name, req.user.userId]
    );

    res.json(updatedUser.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await pool.query("SELECT password FROM users WHERE id = $1", [
      req.user.userId,
    ]);
    if (!user.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      req.user.userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, email,is_blocked,name ,role FROM users"
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    await pool.query("UPDATE users SET is_blocked = true WHERE id = $1", [
      req.params.id,
    ]);
    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    await pool.query("UPDATE users SET is_blocked = false WHERE id = $1", [
      req.params.id,
    ]);
    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
