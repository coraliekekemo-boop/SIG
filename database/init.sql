CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  label VARCHAR(120) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_positions (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  geom GEOMETRY(Point, 4326) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_positions_geom
  ON vehicle_positions USING GIST (geom);

CREATE INDEX IF NOT EXISTS idx_vehicle_positions_vehicle
  ON vehicle_positions (vehicle_id);

CREATE INDEX IF NOT EXISTS idx_vehicle_positions_recorded
  ON vehicle_positions (recorded_at DESC);

INSERT INTO users (username, password_hash)
VALUES ('admin', crypt('admin123', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

INSERT INTO vehicles (code, label, status)
VALUES
  ('ABJ-001', 'Camion Frigo 1', 'active'),
  ('ABJ-002', 'Fourgon Distribution', 'active')
ON CONFLICT (code) DO NOTHING;
