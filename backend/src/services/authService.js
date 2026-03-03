const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const signToken = (user) =>
  jwt.sign(
    { sub: user.id, username: user.username },
    process.env.JWT_SECRET || "change_me_in_production",
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );

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
  const token = signToken(user);

  return { token, user };
};

const register = async (username, password) => {
  const query = `
    INSERT INTO users (username, password_hash)
    VALUES ($1, crypt($2, gen_salt('bf')))
    RETURNING id, username
  `;

  try {
    const { rows } = await pool.query(query, [username, password]);
    const user = rows[0];
    const token = signToken(user);
    return { token, user };
  } catch (error) {
    if (error.code === "23505") {
      return null;
    }
    throw error;
  }
};

module.exports = { login, register };
