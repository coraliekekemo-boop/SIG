const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "sigdb",
  user: process.env.DB_USER || "siguser",
  password: process.env.DB_PASSWORD || "sigpass",
});

module.exports = pool;
