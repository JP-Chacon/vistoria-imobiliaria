CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE inspection_status AS ENUM ('pending', 'scheduled', 'completed');

CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  inspector_name VARCHAR(255) NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status inspection_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_inspections_updated_at
BEFORE UPDATE ON inspections
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

