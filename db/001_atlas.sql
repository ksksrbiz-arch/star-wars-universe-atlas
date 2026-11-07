CREATE TABLE IF NOT EXISTS atlas_works (id text PRIMARY KEY, series_id text NOT NULL, kind text NOT NULL CHECK(kind IN ('film','episode')), payload jsonb NOT NULL);
CREATE INDEX IF NOT EXISTS atlas_works_series_idx ON atlas_works(series_id);
CREATE TABLE IF NOT EXISTS atlas_worlds (id text PRIMARY KEY, grid text NOT NULL, payload jsonb NOT NULL);
-- Some appearance worlds have no verified placement; world_id intentionally is not a mapped-world foreign key.
CREATE TABLE IF NOT EXISTS atlas_appearances (work_id text NOT NULL REFERENCES atlas_works(id), world_id text NOT NULL, payload jsonb NOT NULL, PRIMARY KEY(work_id,world_id));
CREATE INDEX IF NOT EXISTS atlas_appearances_world_idx ON atlas_appearances(world_id);
CREATE TABLE IF NOT EXISTS atlas_sequences (id text PRIMARY KEY, payload jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS atlas_sequence_items (sequence_id text NOT NULL REFERENCES atlas_sequences(id), work_id text NOT NULL REFERENCES atlas_works(id), position integer NOT NULL CHECK(position>0), PRIMARY KEY(sequence_id,work_id), UNIQUE(sequence_id,position));
CREATE TABLE IF NOT EXISTS atlas_map_layers (id text PRIMARY KEY, kind text NOT NULL CHECK(kind IN ('region','route')), payload jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS atlas_publications (id text PRIMARY KEY, published_at timestamptz NOT NULL DEFAULT now(), payload jsonb NOT NULL);
