import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPublication, validateSequenceExtensions, datasetDigest, appearanceDigest } from './appearance-publication.mjs';
import { PGlite } from '@electric-sql/pglite';
// Embedded PostgreSQL tests do not connect to a live writer or test multi-client locking.
const schema = await readFile('db/001_atlas.sql', 'utf8');
const before = { id: 'fixture', title: 'Season 1', itemIds: ['old'] };
const after = { id: 'fixture', title: 'Seasons 1–2', itemIds: ['old', 'new'] };
const works = ['old', 'new'].map(id => ({ id, seriesId: 'fixture', kind: 'episode' }));
const make = (sequences, catalog, sequenceBaselines = []) => buildPublication([], { works: catalog.length, worlds: 0, mappedWorlds: [], catalog, sequences, sequenceBaselines });
const previous = make([before], works.slice(0, 1));
const next = make([after], works, [before]);
assert.throws(() => validateSequenceExtensions([{ ...after, itemIds: ['new', 'old'] }], [before]), /prefix/);
assert.throws(() => validateSequenceExtensions([{ ...after, itemIds: ['old', 'old'] }], [before]), /duplicate/);
assert.throws(() => validateSequenceExtensions([{ ...before, title: 'Changed' }], [before]), /actual extension/);
const db = await PGlite.create();
try {
 await db.exec(schema);
 const reset = async () => {
  await db.exec('TRUNCATE atlas_sequence_items, atlas_sequences, atlas_appearances, atlas_works, atlas_worlds, atlas_publications;');
  await db.query("INSERT INTO atlas_publications(id,payload) VALUES ('initial-2026-11-07','{}')");
  await db.exec(previous.sql);
 };
 await reset(); await db.exec(next.sql);
 assert.deepEqual((await db.query('SELECT payload FROM atlas_sequences')).rows[0].payload, after);
 assert.deepEqual((await db.query('SELECT work_id,position FROM atlas_sequence_items ORDER BY position')).rows, [{ work_id: 'old', position: 1 }, { work_id: 'new', position: 2 }]);
 const published = (await db.query('SELECT * FROM atlas_publications ORDER BY id')).rows;
 await db.exec(next.sql);
 assert.deepEqual((await db.query('SELECT * FROM atlas_publications ORDER BY id')).rows, published);
 for (const mutation of ["UPDATE atlas_sequences SET payload=payload || '{\"title\":\"Unexpected\"}'", 'UPDATE atlas_sequence_items SET position=999']) {
  await reset(); await db.exec(mutation);
  await assert.rejects(db.exec(next.sql), /sequence.*conflicts/); await db.exec('ROLLBACK');
  assert.equal((await db.query('SELECT count(*)::int AS n FROM atlas_works')).rows[0].n, 1, 'Conflict cannot partially insert new works');
  assert.equal((await db.query('SELECT count(*)::int AS n FROM atlas_publications WHERE id=$1', [next.manifest.id])).rows[0].n, 0);
 }
 await reset();
 await assert.rejects(db.exec(make([after], works).sql), /sequence conflicts/); await db.exec('ROLLBACK');
 console.log('PASS embedded PostgreSQL: reviewed prefix extension, stable old positions, idempotent replay, unexpected payload/order rejection and transactional rollback');
 if (process.argv.includes('--live-baseline')) {
  const data = Object.fromEntries(await Promise.all(['catalog','worlds','sequences','appearances'].map(async route => [route, (await (await fetch(`https://star-wars-universe-atlas.skdev-371.workers.dev/api/${route}?baseline=${Date.now()}`)).json()).items])));
  await db.exec('TRUNCATE atlas_sequence_items, atlas_sequences, atlas_appearances, atlas_works, atlas_worlds, atlas_publications;');
  await db.query("INSERT INTO atlas_publications(id,payload) VALUES ('initial-2026-11-07','{}')");
  await db.exec(buildPublication(data.appearances, { works: data.catalog.length, worlds: data.worlds.length, mappedWorlds: data.worlds, catalog: data.catalog, sequences: data.sequences }).sql);
  await db.exec(await readFile('db/publications/appearances.sql','utf8'));
  const manifest=JSON.parse(await readFile('db/publications/appearances.json','utf8'));
  for (const [table,key,digest] of [['atlas_works','catalogSha256',datasetDigest],['atlas_worlds','worldsSha256',datasetDigest],['atlas_sequences','sequencesSha256',datasetDigest],['atlas_appearances','sha256',appearanceDigest]]) assert.equal(digest((await db.query(`SELECT payload FROM ${table}`)).rows.map(row=>row.payload)),manifest[key]);
  console.log('PASS full reviewed publication against an embedded copy of all four live baseline datasets');
 }
} finally { await db.close(); }
