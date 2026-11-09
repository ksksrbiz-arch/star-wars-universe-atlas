import test from 'node:test';
import assert from 'node:assert/strict';
import { extractWikiAppearanceCandidates } from './wiki-appearances.mjs';

const catalog = [
  { id: 'cw-gathering', kind: 'episode', seriesId: 'clone-wars', title: 'The Gathering' },
  { id: 'cw-strength', kind: 'episode', seriesId: 'clone-wars', title: 'A Test of Strength' },
  { id: 'andor-eye', kind: 'episode', seriesId: 'andor', title: 'The Eye' },
  { id: 'mando-heiress', kind: 'episode', seriesId: 'mandalorian', title: 'Chapter 11: The Heiress' },
  { id: 'rebels-heroes', kind: 'episode', seriesId: 'rebels', title: 'Heroes of Mandalore' },
];
const page = (text, extra = {}) => ({ providerId: '123', revisionId: 456, continuity: 'canon', sourceUrl: 'https://starwars.fandom.com/wiki/Example', raw: { wikitext: text }, ...extra });
const extract = (text, extra) => extractWikiAppearanceCandidates([page(`==Appearances==\n${text}`, extra)], catalog).candidates;

test('only anchored appearance citations are read; prose, sources and Non-canon lists stay out', () => {
  const rows = extractWikiAppearanceCandidates([page(`Intro {{TCW|The Gathering}}\n==Appearances==\n*Prose referring to {{TCW|The Gathering}}\n*{{TCW|The Gathering (episode)}} {{1st}}\n===Non-canon appearances===\n*{{TCW|A Test of Strength}}\n==Sources==\n*{{Andor|The Eye}}`)], catalog).candidates;
  assert.equal(rows.length, 1); assert.equal(rows[0].sourceReportedTitle, 'The Gathering (episode)');
  assert.deepEqual(rows[0].canonicalItemIds, ['cw-gathering']); assert.equal(rows[0].context, 'appearance');
  assert.deepEqual(rows[0].markers, ['first']); assert.equal(rows[0].pageRevisionId, 456);
});

test('mentions and flashbacks remain distinct; unknown, deleted and mixed annotations never imply an appearance', () => {
  const rows = extract('*{{TCW|The Gathering}} {{Mo}}\n*{{TCW|A Test of Strength}} {{Flash}}\n*{{TCW|The Gathering}} {{Hologram}}\n*{{TCW|The Gathering}} {{Del}}\n*{{TCW|The Gathering}} {{Mo}} {{Flash}}\n*{{TCW|The Gathering}} {{C|Only in [[a vision|a dream]]}}');
  assert.deepEqual(rows.map(row => row.context), ['mention', 'flashback', 'unknown', 'unknown', 'unknown', 'unknown']);
  assert(rows[2].markers.includes('unknown:Hologram')); assert(rows[3].markers.includes('del'));
  assert(rows.every(row => row.status === 'source-reported-candidate-not-published'));
});

test('unknown templates, wrong-series titles and near matches stay unmatched', () => {
  const rows = extract('*{{SkeletonCrew|The Gathering}}\n*{{TCW|The Eye}}\n*{{TCW|The Gatherings}}\n*{{TheMandalorian|Chapter 11: The Heiress}}\n*{{Film|V}}\n*{{StoryCite|story=The Gathering|book=Some book}}');
  assert.equal(rows.length, 4);
  assert.equal(rows[0].seriesId, null); assert.equal(rows[0].context, 'unknown');
  assert.deepEqual(rows.slice(0, 3).map(row => row.canonicalItemIds), [[], [], []]);
  assert.deepEqual(rows[3].canonicalItemIds, ['mando-heiress']);
});

test('Legends and unknown scope are retained without borrowing the Canon catalog id', () => {
  const text = '==Appearances==\n*{{TCW|The Gathering}}';
  const result = extractWikiAppearanceCandidates([page(text), page(text, { providerId: '124', continuity: 'legends' }), page(text, { providerId: '125', continuity: 'unknown' })], catalog);
  assert.equal(result.candidates.length, 3);
  assert.deepEqual(result.candidates.map(row => row.continuity), ['canon', 'legends', 'unknown']);
  assert.deepEqual(result.candidates.map(row => row.canonicalItemIds), [['cw-gathering'], [], []]);
});

test('duplicate episode titles within one series remain an explicitly ambiguous candidate', () => {
  const items = [...catalog, { id: 'cw-gathering-another', kind: 'episode', seriesId: 'clone-wars', title: 'The Gathering' }];
  const { candidates, stats } = extractWikiAppearanceCandidates([page('==Appearances==\n*{{TCW|The Gathering}}')], items);
  assert.deepEqual(candidates[0].canonicalItemIds, ['cw-gathering', 'cw-gathering-another']);
  assert.equal(candidates[0].context, 'unknown'); assert.equal(stats.ambiguousCatalogMatches, 1);
});

test('structural links and episode suffixes match, while unsupported citation parameters are flagged', () => {
  const rows = extract('*{{TCW|[[The Gathering (episode)|The Gathering]]}}\n*{{TCW|The Gathering|del=1}}\n*{{Rebels|Heroes of Mandalore|Part 1}}');
  assert.deepEqual(rows[0].canonicalItemIds, ['cw-gathering']); assert.equal(rows[0].context, 'appearance');
  assert.equal(rows[1].context, 'unknown'); assert(rows[1].markers.includes('del'));
  assert.equal(rows[2].context, 'unknown'); assert.deepEqual(rows[2].canonicalItemIds, ['rebels-heroes']);
});
