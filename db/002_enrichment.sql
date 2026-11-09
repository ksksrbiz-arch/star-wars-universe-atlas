-- Additive provider inventory; none of these tables alter the reviewed atlas graph.
CREATE TABLE IF NOT EXISTS atlas_source_records (
  provider text NOT NULL, provider_id text NOT NULL, entity_type text NOT NULL,
  name text NOT NULL, description text, source_url text NOT NULL,
  payload jsonb NOT NULL, public_payload jsonb NOT NULL,
  payload_sha256 text NOT NULL, collected_at timestamptz NOT NULL,
  PRIMARY KEY(provider,provider_id)
);
CREATE INDEX IF NOT EXISTS atlas_source_records_type_idx ON atlas_source_records(entity_type,lower(name));
CREATE TABLE IF NOT EXISTS atlas_source_snapshots (
  provider text NOT NULL, provider_id text NOT NULL, payload_sha256 text NOT NULL,
  payload jsonb NOT NULL, collected_at timestamptz NOT NULL,
  PRIMARY KEY(provider,provider_id,payload_sha256)
);
CREATE TABLE IF NOT EXISTS atlas_source_media (
  id text NOT NULL, provider text NOT NULL, provider_id text NOT NULL,
  payload jsonb NOT NULL, delivered boolean NOT NULL DEFAULT false,
  PRIMARY KEY(id,provider,provider_id),
  FOREIGN KEY(provider,provider_id) REFERENCES atlas_source_records(provider,provider_id)
);
CREATE TABLE IF NOT EXISTS atlas_source_links (
  provider text NOT NULL, provider_id text NOT NULL, canonical_id text NOT NULL,
  canonical_type text NOT NULL CHECK(canonical_type IN ('episode','world','series')),
  media_id text NOT NULL, accepted boolean NOT NULL DEFAULT false,
  PRIMARY KEY(provider,provider_id,canonical_type,canonical_id),
  FOREIGN KEY(provider,provider_id) REFERENCES atlas_source_records(provider,provider_id),
  FOREIGN KEY(media_id,provider,provider_id) REFERENCES atlas_source_media(id,provider,provider_id)
);
CREATE TABLE IF NOT EXISTS atlas_ingestion_runs (
  id text PRIMARY KEY, started_at timestamptz NOT NULL,
  completed_at timestamptz, status text NOT NULL, payload jsonb NOT NULL
);
-- Public views deliberately omit raw payloads, matching candidates and unreviewed joins.
CREATE OR REPLACE VIEW atlas_databank_public AS
SELECT r.provider,r.provider_id,r.entity_type,r.name,
  r.public_payload || CASE WHEN m.payload IS NULL THEN '{}'::jsonb ELSE jsonb_build_object('image',jsonb_strip_nulls(jsonb_build_object(
    'src',m.payload->>'src','srcSet',m.payload->>'srcSet','credit',m.payload->>'credit','sourceUrl',m.payload->>'sourceUrl'))) END
  || CASE WHEN c.payload IS NULL THEN '{}'::jsonb ELSE jsonb_build_object('cutout',jsonb_strip_nulls(jsonb_build_object(
    'src',c.payload->>'src','srcSet',c.payload->>'srcSet','credit',c.payload->>'credit','sourceUrl',c.payload->>'sourceUrl'))) END AS payload
FROM atlas_source_records r
LEFT JOIN LATERAL (SELECT payload FROM atlas_source_media
  WHERE provider=r.provider AND provider_id=r.provider_id AND delivered AND COALESCE(payload->>'kind','')<>'character-cutout'
  ORDER BY payload->>'deliveredAt' DESC NULLS LAST,id LIMIT 1) m ON true
LEFT JOIN LATERAL (SELECT payload FROM atlas_source_media
  WHERE provider=r.provider AND provider_id=r.provider_id AND delivered AND r.entity_type='character' AND payload->>'kind'='character-cutout'
  ORDER BY payload->>'deliveredAt' DESC NULLS LAST,id LIMIT 1) c ON true
WHERE r.provider='databank' AND r.entity_type IN ('location','character');
CREATE OR REPLACE VIEW atlas_media_public AS
SELECT l.canonical_id,l.canonical_type,l.provider,
 jsonb_strip_nulls(jsonb_build_object('entityId',l.canonical_id,'entityType',l.canonical_type,
 'src',m.payload->>'src','srcSet',m.payload->>'srcSet','credit',m.payload->>'credit',
 'sourceUrl',m.payload->>'sourceUrl','provider',l.provider)) AS payload
FROM atlas_source_links l JOIN atlas_source_media m ON m.id=l.media_id AND m.provider=l.provider AND m.provider_id=l.provider_id
WHERE l.accepted AND m.delivered;
-- Existing database default privileges may grant SELECT on new owner-created tables.
-- Explicitly remove that inheritance before exposing only the reviewed views.
REVOKE ALL ON atlas_source_records,atlas_source_snapshots,atlas_source_media,atlas_source_links,atlas_ingestion_runs FROM atlas_reader,PUBLIC;
GRANT SELECT ON atlas_databank_public,atlas_media_public TO atlas_reader;
