import { createHash } from 'node:crypto';

// Object-key ordering and input order must not change the identity of the dataset.
export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export function appearanceDigest(connections) {
  const sorted = [...connections].sort((a,b) => a.itemId < b.itemId ? -1 : a.itemId > b.itemId ? 1 : a.worldId < b.worldId ? -1 : a.worldId > b.worldId ? 1 : 0);
  return createHash('sha256').update(canonicalJson(sorted)).digest('hex');
}
export const datasetDigest = rows => createHash('sha256').update(canonicalJson([...rows].sort((a,b)=>a.id.localeCompare(b.id)))).digest('hex');
export function buildPublication(connections, {works, worlds, catalog, sequences, mappedWorlds}) {
  const keys = new Set();
  for (const row of connections) {
    const key = JSON.stringify([row.itemId,row.worldId]);
    if (keys.has(key)) throw new Error('Duplicate appearance key');
    keys.add(key);
    if (!row.itemId || !row.worldId || !row.sourceUrl || !row.note) throw new Error('Incomplete appearance evidence');
  }
  if (mappedWorlds) {
    if (mappedWorlds.length !== worlds || new Set(mappedWorlds.map(w=>w.id)).size !== worlds) throw new Error('Mapped world count/identity mismatch');
    for (const world of mappedWorlds) {
      if (!world.id || !world.grid || !Number.isFinite(world.x) || !Number.isFinite(world.y) || !world.sourceUrl || !world.uncertainty) throw new Error('Incomplete mapped world evidence');
    }
  }
  const sha256=appearanceDigest(connections);
  const manifest={id:`appearances-sha256-${sha256}`,sha256,works,worlds,appearances:connections.length,coveredTitles:new Set(connections.map(row=>row.itemId)).size};
  if (mappedWorlds) manifest.worldsSha256=datasetDigest(mappedWorlds);
  if (catalog && sequences) {
    manifest.catalogSha256=datasetDigest(catalog);
    manifest.sequencesSha256=datasetDigest(sequences);
    manifest.sequences=sequences.length;

  }
  if (mappedWorlds || (catalog && sequences)) manifest.id=`catalog-sha256-${createHash('sha256').update(canonicalJson(manifest)).digest('hex')}`;
  const literal=value=>`'${JSON.stringify(value).replaceAll("'","''")}'::jsonb`;
  const worldsSql = mappedWorlds ? `
CREATE TEMP TABLE desired_worlds (id text PRIMARY KEY, grid text NOT NULL, payload jsonb NOT NULL) ON COMMIT DROP;
INSERT INTO desired_worlds SELECT value->>'id',value->>'grid',value FROM jsonb_array_elements(${literal(mappedWorlds)});
DO $worlds$
BEGIN
 IF EXISTS (SELECT 1 FROM atlas_worlds a LEFT JOIN desired_worlds d USING(id) WHERE d.id IS NULL OR a.grid IS DISTINCT FROM d.grid OR a.payload IS DISTINCT FROM d.payload) THEN RAISE EXCEPTION 'Existing mapped world evidence conflicts with reviewed dataset'; END IF;
END $worlds$;
INSERT INTO atlas_worlds SELECT * FROM desired_worlds ON CONFLICT(id) DO NOTHING;
` : '';
  const catalogSql = catalog && sequences ? `
CREATE TEMP TABLE desired_works (id text PRIMARY KEY, series_id text, kind text, payload jsonb) ON COMMIT DROP;
INSERT INTO desired_works SELECT value->>'id',value->>'seriesId',value->>'kind',value FROM jsonb_array_elements(${literal(catalog)});
CREATE TEMP TABLE desired_sequences (id text PRIMARY KEY, payload jsonb) ON COMMIT DROP;
INSERT INTO desired_sequences SELECT value->>'id',value FROM jsonb_array_elements(${literal(sequences)});
CREATE TEMP TABLE desired_sequence_items (sequence_id text,work_id text,position integer,PRIMARY KEY(sequence_id,work_id),UNIQUE(sequence_id,position)) ON COMMIT DROP;
INSERT INTO desired_sequence_items SELECT s.id,i.value,i.ordinality::int FROM desired_sequences s CROSS JOIN LATERAL jsonb_array_elements_text(s.payload->'itemIds') WITH ORDINALITY i(value,ordinality);
DO $catalog$
BEGIN
 IF EXISTS (SELECT 1 FROM atlas_works a LEFT JOIN desired_works d USING(id) WHERE d.id IS NULL OR a.payload IS DISTINCT FROM d.payload OR a.series_id IS DISTINCT FROM d.series_id OR a.kind IS DISTINCT FROM d.kind) THEN RAISE EXCEPTION 'Existing catalog conflicts with reviewed dataset'; END IF;
 IF EXISTS (SELECT 1 FROM atlas_sequences a LEFT JOIN desired_sequences d USING(id) WHERE d.id IS NULL OR a.payload IS DISTINCT FROM d.payload) THEN RAISE EXCEPTION 'Existing sequence conflicts with reviewed dataset'; END IF;
 IF EXISTS (SELECT 1 FROM atlas_sequence_items a LEFT JOIN desired_sequence_items d USING(sequence_id,work_id) WHERE d.work_id IS NULL OR a.position IS DISTINCT FROM d.position) THEN RAISE EXCEPTION 'Existing sequence order conflicts with reviewed dataset'; END IF;
END $catalog$;
INSERT INTO atlas_works SELECT * FROM desired_works ON CONFLICT(id) DO NOTHING;
INSERT INTO atlas_sequences SELECT * FROM desired_sequences ON CONFLICT(id) DO NOTHING;
INSERT INTO atlas_sequence_items SELECT * FROM desired_sequence_items ON CONFLICT(sequence_id,work_id) DO NOTHING;
` : '';
  const sql=`-- Generated by scripts/prepare-appearance-publication.mjs; review with its JSON manifest.
-- Additive only: changed or unexpected existing evidence aborts the entire transaction.
BEGIN;
SET LOCAL search_path = public, pg_temp;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '60s';
LOCK TABLE atlas_works, atlas_worlds, atlas_appearances, atlas_publications, atlas_sequences, atlas_sequence_items IN SHARE ROW EXCLUSIVE MODE;
${worldsSql}
${catalogSql}
CREATE TEMP TABLE desired_appearances (work_id text NOT NULL, world_id text NOT NULL, payload jsonb NOT NULL, PRIMARY KEY(work_id,world_id)) ON COMMIT DROP;
INSERT INTO desired_appearances SELECT value->>'itemId',value->>'worldId',value FROM jsonb_array_elements(${literal(connections)});
DO $publication$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM atlas_publications WHERE id='initial-2026-11-07') THEN RAISE EXCEPTION 'Required initial publication missing'; END IF;
 IF (SELECT count(*) FROM atlas_works) <> ${works} OR (SELECT count(*) FROM atlas_worlds) <> ${worlds} THEN RAISE EXCEPTION 'Catalog/map baseline differs from reviewed publication'; END IF;
 IF EXISTS (SELECT 1 FROM desired_appearances d LEFT JOIN atlas_works w ON w.id=d.work_id WHERE w.id IS NULL) THEN RAISE EXCEPTION 'Appearance references an unknown work'; END IF;
 IF EXISTS (SELECT 1 FROM atlas_appearances a LEFT JOIN desired_appearances d USING(work_id,world_id) WHERE d.work_id IS NULL OR a.payload IS DISTINCT FROM d.payload) THEN RAISE EXCEPTION 'Existing appearance evidence conflicts with reviewed dataset'; END IF;
 IF EXISTS (SELECT 1 FROM atlas_publications WHERE id='${manifest.id}' AND payload IS DISTINCT FROM ${literal(manifest)}) THEN RAISE EXCEPTION 'Publication identity already has different metadata'; END IF;
END $publication$;
INSERT INTO atlas_appearances(work_id,world_id,payload) SELECT work_id,world_id,payload FROM desired_appearances ON CONFLICT(work_id,world_id) DO NOTHING;
INSERT INTO atlas_publications(id,payload) VALUES ('${manifest.id}',${literal(manifest)}) ON CONFLICT(id) DO NOTHING;
COMMIT;
`;
  return {manifest,sql};
}
