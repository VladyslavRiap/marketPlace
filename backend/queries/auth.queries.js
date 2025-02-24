module.exports = {
  GET_EMAIL_USER: "SELECT * FROM users WHERE email = $1",
  SIGN_USER:
    "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
  REFRESH_TOKEN: "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
  GET_REFRESH_TOKEN: "SELECT * FROM refresh_tokens WHERE token = $1",
  DELETE_REFRESH_TOKEN: "DELETE FROM refresh_tokens WHERE token = $1",
};
