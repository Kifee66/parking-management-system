/*This is the schema I used to create the Database tables in supabase*/

CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id SERIAL PRIMARY KEY,
  registration_no TEXT UNIQUE NOT NULL,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('Car', 'Motorcycle', 'Truck')),
  owner_name TEXT NOT NULL,
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parking_slots (
  slot_id SERIAL PRIMARY KEY,
  slot_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OCCUPIED')),
  vehicle_id INTEGER REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parking_rates (
  rate_id SERIAL PRIMARY KEY,
  vehicle_type TEXT UNIQUE NOT NULL CHECK (vehicle_type IN ('Car', 'Motorcycle', 'Truck')),
  rate_per_hour NUMERIC(10,2) NOT NULL CHECK (rate_per_hour >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parking_transactions (
  transaction_id SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE RESTRICT,
  slot_id INTEGER NOT NULL REFERENCES parking_slots(slot_id) ON DELETE RESTRICT,
  entry_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  exit_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  amount_due NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED')),
  payment_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO parking_rates (vehicle_type, rate_per_hour)
VALUES
  ('Car', 150.00),
  ('Motorcycle', 80.00),
  ('Truck', 220.00)
ON CONFLICT (vehicle_type) DO NOTHING;

INSERT INTO parking_slots (slot_number, status)
SELECT
  'A' || LPAD((n)::text, 2, '0'),
  'AVAILABLE'
FROM generate_series(1, 20) AS t(n)
ON CONFLICT (slot_number) DO NOTHING;
