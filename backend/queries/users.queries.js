module.exports = {
  GET_USER_BY_ID: "SELECT id, email, role, name FROM users WHERE id = $1",
  GET_USER_PASSWORD: "SELECT password FROM users WHERE id = $1",
  GET_USER_BY_EMAIL: "SELECT * FROM users WHERE email = $1",
  CREATE_USER:
    "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
  UPDATE_USER_NAME:
    "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name, role",
  UPDATE_USER_PASSWORD: "UPDATE users SET password = $1 WHERE id = $2",
};
