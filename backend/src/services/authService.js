const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const login = async (username, password) => {
  const query = `
    SELECT id, username
    FROM users
    WHERE username = $1
      AND password_hash = crypt($2, password_hash)
  `;

  const { rows } = await pool.query(query, [username, password]);
  if (!rows.length) {
    return null;
  }

  const user = rows[0];
  const token = jwt.sign(
    { sub: user.id, username: user.username },
    process.env.JWT_SECRET || "change_me_in_production",
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );

  return { token, user };
};

module.exports = { login };
