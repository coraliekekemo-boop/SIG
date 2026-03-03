const pool = require("../config/db");

const listVehicles = async () => {
  const { rows } = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
  return rows;
};

const createVehicle = async ({ code, label, status }) => {
  const query = `
    INSERT INTO vehicles (code, label, status)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [code, label, status || "active"]);
  return rows[0];
};

const updateVehicle = async (id, payload) => {
  const query = `
    UPDATE vehicles
    SET code = $1,
        label = $2,
        status = $3,
        updated_at = NOW()
    WHERE id = $4
    RETURNING *
  `;
  const { rows } = await pool.query(query, [payload.code, payload.label, payload.status, id]);
  return rows[0] || null;
};

const removeVehicle = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);
  return rowCount > 0;
};

module.exports = {
  listVehicles,
  createVehicle,
  updateVehicle,
  removeVehicle,
};
