const pool = require("../config/db");

const insertPosition = async ({ vehicleId, latitude, longitude, recordedAt }) => {
  const query = `
    INSERT INTO vehicle_positions (vehicle_id, geom, recorded_at)
    VALUES ($1, ST_SetSRID(ST_Point($2, $3), 4326), COALESCE($4, NOW()))
    RETURNING
      id,
      vehicle_id,
      ST_Y(geom) AS latitude,
      ST_X(geom) AS longitude,
      recorded_at
  `;

  const params = [vehicleId, longitude, latitude, recordedAt || null];
  const { rows } = await pool.query(query, params);
  return rows[0];
};

const getLatestPositions = async () => {
  const query = `
    SELECT DISTINCT ON (vp.vehicle_id)
      vp.vehicle_id,
      v.code,
      v.label,
      v.status,
      ST_Y(vp.geom) AS latitude,
      ST_X(vp.geom) AS longitude,
      vp.recorded_at
    FROM vehicle_positions vp
    JOIN vehicles v ON v.id = vp.vehicle_id
    ORDER BY vp.vehicle_id, vp.recorded_at DESC
  `;

  const { rows } = await pool.query(query);
  return rows;
};

const getVehicleHistory = async (vehicleId, from, to) => {
  const query = `
    SELECT
      ST_Y(geom) AS latitude,
      ST_X(geom) AS longitude,
      recorded_at
    FROM vehicle_positions
    WHERE vehicle_id = $1
      AND ($2::timestamptz IS NULL OR recorded_at >= $2::timestamptz)
      AND ($3::timestamptz IS NULL OR recorded_at <= $3::timestamptz)
    ORDER BY recorded_at ASC
  `;

  const { rows } = await pool.query(query, [vehicleId, from || null, to || null]);
  return rows;
};

const searchInRadius = async (latitude, longitude, radiusMeters) => {
  const query = `
    WITH latest AS (
      SELECT DISTINCT ON (vp.vehicle_id)
        vp.vehicle_id,
        ST_Transform(vp.geom, 4326) AS geom,
        vp.recorded_at
      FROM vehicle_positions vp
      ORDER BY vp.vehicle_id, vp.recorded_at DESC
    )
    SELECT
      l.vehicle_id,
      v.code,
      v.label,
      ST_Y(l.geom) AS latitude,
      ST_X(l.geom) AS longitude,
      ROUND(
        ST_Distance(
          l.geom::geography,
          ST_SetSRID(ST_Point($1, $2), 4326)::geography
        )::numeric,
        2
      ) AS distance_meters
    FROM latest l
    JOIN vehicles v ON v.id = l.vehicle_id
    WHERE ST_DWithin(
      l.geom::geography,
      ST_SetSRID(ST_Point($1, $2), 4326)::geography,
      $3
    )
    ORDER BY distance_meters ASC
  `;

  const { rows } = await pool.query(query, [longitude, latitude, radiusMeters]);
  return rows;
};

const nearestVehicle = async (latitude, longitude) => {
  const query = `
    WITH latest AS (
      SELECT DISTINCT ON (vp.vehicle_id)
        vp.vehicle_id,
        ST_Transform(vp.geom, 4326) AS geom,
        vp.recorded_at
      FROM vehicle_positions vp
      ORDER BY vp.vehicle_id, vp.recorded_at DESC
    )
    SELECT
      l.vehicle_id,
      v.code,
      v.label,
      ST_Y(l.geom) AS latitude,
      ST_X(l.geom) AS longitude,
      ROUND(
        ST_Distance(
          l.geom::geography,
          ST_SetSRID(ST_Point($1, $2), 4326)::geography
        )::numeric,
        2
      ) AS distance_meters
    FROM latest l
    JOIN vehicles v ON v.id = l.vehicle_id
    ORDER BY ST_Distance(
      l.geom::geography,
      ST_SetSRID(ST_Point($1, $2), 4326)::geography
    ) ASC
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [longitude, latitude]);
  return rows[0] || null;
};

module.exports = {
  insertPosition,
  getLatestPositions,
  getVehicleHistory,
  searchInRadius,
  nearestVehicle,
};
