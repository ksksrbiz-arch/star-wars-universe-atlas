"""Build a minimal catalog from the checked local audit CSVs; no network requests.

Run from any directory: python scripts/build-catalog.py
Optional --audit-dir selects the folder containing episode-coverage.csv and
original-trilogy-coverage.csv. Generated output is checked in for normal builds.
"""
import argparse
import collections
import csv
import hashlib
import json
import pathlib
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--audit-dir', type=pathlib.Path, default=ROOT / 'docs')
args = parser.parse_args()
episode_path = args.audit_dir / 'episode-coverage.csv'
film_path = args.audit_dir / 'original-trilogy-coverage.csv'

def read_csv(path):
    with path.open(encoding='utf-8-sig', newline='') as stream:
        return list(csv.DictReader(stream))

def title(value):
    return ' '.join(unicodedata.normalize('NFC', value).split())

series_ids = {'Andor': 'andor', 'Star Wars: The Clone Wars': 'clone-wars', 'The Mandalorian': 'mandalorian'}
episode_rows = read_csv(episode_path)
items = []
excluded = []
for row in episode_rows:
    if row['type'] != 'regular' or row.get('import_classification') != 'core_episode':
        excluded.append({'sourceId': row['tvmaze_id'], 'seriesId': series_ids[row['series']], 'title': title(row['title']), 'reason': 'Special; outside the completed regular-episode cohort.'})
        continue
    series = series_ids[row['series']]
    season, number = int(row['season']), int(row['episode'])
    runtime = int(row['runtime']) if row['runtime'] else None
    note = 'Provider runtime; streaming duration and credit treatment not independently verified.'
    if series == 'clone-wars':
        runtime = None
        note = 'Unknown verified duration. Audit found the same 30-minute provider value for all 133 episodes; withheld from runtime totals.'
    items.append({'id': f'{series}-s{season:02d}e{number:02d}', 'title': title(row['title']), 'seriesId': series, 'kind': 'episode', 'season': season, 'episode': number, 'releaseDate': row['airdate'], 'runtimeMinutes': runtime, 'runtimeNote': note, 'sourceUrl': row['source']})

film_ids = {'4': 'ot-a-new-hope', '5': 'ot-empire-strikes-back', '6': 'ot-return-of-the-jedi'}
for row in read_csv(film_path):
    items.append({'id': film_ids[row['episode_id']], 'title': title(row['title']), 'seriesId': 'ot', 'kind': 'film', 'releaseDate': row['release_date'], 'runtimeMinutes': None, 'runtimeNote': 'Runtime omitted pending edition-specific verification.', 'sourceUrl': row['source_url']})
items.append({'id': 'clone-wars-film', 'title': 'Star Wars: The Clone Wars', 'seriesId': 'clone-wars', 'kind': 'film', 'releaseDate': '2008-08-15', 'runtimeMinutes': None, 'runtimeNote': 'Film runtime omitted pending edition-specific verification; not the provider’s 30-minute television value.', 'sourceUrl': 'https://www.starwars.com/films/star-wars-the-clone-wars'})
# Separate reviewed extension; retain the original 185-item CSV audit cohort intact.
original_cohort_count = len(items)
assert original_cohort_count == 185
extension_path = ROOT / 'docs/ahsoka-season-1-source.json'
extension = json.loads(extension_path.read_text(encoding='utf-8'))
assert len(extension['episodes']) == 8
assert sorted(e['number'] for e in extension['episodes']) == list(range(1, 9))
for episode in extension['episodes']:
    assert episode['season'] == 1
    items.append({'id': f"ahsoka-s01e{episode['number']:02d}", 'title': title(episode['name']), 'seriesId': 'ahsoka', 'kind': 'episode', 'season': 1, 'episode': episode['number'], 'releaseDate': episode['airdate'], 'runtimeMinutes': None, 'runtimeNote': 'Runtime withheld pending streaming-edition and credit-treatment verification.', 'sourceUrl': episode['url']})
rogue_path = ROOT / 'docs/rogue-one-source.json'
rogue = json.loads(rogue_path.read_text(encoding='utf-8'))
items.append({'id': rogue['id'], 'title': rogue['title'], 'seriesId': 'rogue-one', 'kind': 'film', 'releaseDate': rogue['releaseDate'], 'runtimeMinutes': None, 'runtimeNote': rogue['runtimeNote'], 'sourceUrl': rogue['sourceUrl']})
boba_path = ROOT / 'docs/boba-fett-source.json'
boba = json.loads(boba_path.read_text(encoding='utf-8'))
assert len(boba['episodes']) == 7
assert sorted(e['number'] for e in boba['episodes']) == list(range(1, 8))
for episode in boba['episodes']:
    assert episode['season'] == 1
    items.append({'id': f"boba-fett-s01e{episode['number']:02d}", 'title': title(episode['name']), 'seriesId': 'boba-fett', 'kind': 'episode', 'season': 1, 'episode': episode['number'], 'releaseDate': episode['airdate'], 'runtimeMinutes': None, 'runtimeNote': 'Runtime withheld pending independent verification.', 'sourceUrl': episode['url']})
prequel_path = ROOT / 'docs/prequel-trilogy-source.json'
prequel = json.loads(prequel_path.read_text(encoding='utf-8'))
assert len(prequel['films']) == 3
for film in prequel['films']:
    items.append({'id': film['id'], 'title': film['title'], 'seriesId': 'pt', 'kind': 'film', 'releaseDate': film['releaseDate'], 'runtimeMinutes': None, 'runtimeNote': film['runtimeNote'], 'sourceUrl': film['sourceUrl']})
rebels_path = ROOT / 'docs/rebels-season-1-source.json'
rebels = json.loads(rebels_path.read_text(encoding='utf-8'))
assert len(rebels['episodes']) == 14
assert [e['number'] for e in rebels['episodes']] == [1] + list(range(3, 16))
for episode in rebels['episodes']:
    item = {'id': episode['id'], 'title': title(episode['name']), 'seriesId': 'rebels', 'kind': 'episode', 'season': 1, 'episode': episode['number'], 'releaseDate': episode['airdate'], 'runtimeMinutes': None, 'runtimeNote': episode.get('note', 'Official episode number normalized from provider numbering; runtime withheld pending edition-specific verification.'), 'sourceUrl': episode['sourceUrl']}
    if 'episodeEnd' in episode: item['episodeEnd'] = episode['episodeEnd']
    items.append(item)
rebels2_path = ROOT / 'docs/rebels-season-2-source.json'
rebels2 = json.loads(rebels2_path.read_text(encoding='utf-8'))
assert len(rebels2['episodes']) == 20
for episode in rebels2['episodes']:
    item = {'id': episode['id'], 'title': title(episode['name']), 'seriesId': 'rebels', 'kind': 'episode', 'season': 2, 'episode': episode['number'], 'releaseDate': episode['airdate'], 'runtimeMinutes': None, 'runtimeNote': episode['note'], 'sourceUrl': episode['sourceUrl']}
    if 'episodeEnd' in episode: item['episodeEnd'] = episode['episodeEnd']
    items.append(item)
rebels3_path = ROOT / 'docs/rebels-season-3-source.json'
rebels3 = json.loads(rebels3_path.read_text(encoding='utf-8'))
assert len(rebels3['episodes']) == 19
for episode in rebels3['episodes']:
    item = {'id': episode['id'], 'title': title(episode['name']), 'seriesId': 'rebels', 'kind': 'episode', 'season': 3, 'episode': episode['number'], 'releaseDate': episode['airdate'], 'runtimeMinutes': None, 'runtimeNote': episode['note'], 'sourceUrl': episode['sourceUrl']}
    if 'episodeEnd' in episode: item['episodeEnd'] = episode['episodeEnd']
    items.append(item)
rebels4_path = ROOT / 'docs/rebels-season-4-source.json'
rebels4 = json.loads(rebels4_path.read_text(encoding='utf-8'))
assert len(rebels4['episodes']) == 13
for episode in rebels4['episodes']:
    item = {'id': episode['id'], 'title': title(episode['name']), 'seriesId': 'rebels', 'kind': 'episode', 'season': 4, 'episode': episode['number'], 'releaseDate': episode['airdate'], 'runtimeMinutes': None, 'runtimeNote': episode['note'], 'sourceUrl': episode['sourceUrl']}
    if 'episodeEnd' in episode: item['episodeEnd'] = episode['episodeEnd']
    items.append(item)
bad_batch_path = ROOT / 'docs/bad-batch-season-1-source.json'
bad_batch = json.loads(bad_batch_path.read_text(encoding='utf-8'))
assert [e['number'] for e in bad_batch['episodes']] == list(range(1,17))
for episode in bad_batch['episodes']:
    items.append({'id': episode['id'], 'title': title(episode['name']), 'seriesId': 'bad-batch', 'kind': 'episode', 'season': 1, 'episode': episode['number'], 'releaseDate': episode['airdate'], 'runtimeMinutes': None, 'runtimeNote': 'Runtime withheld pending edition-specific verification; extended premiere is one episode record.', 'sourceUrl': episode['sourceUrl']})
bad_batch2_path = ROOT / 'docs/bad-batch-season-2-source.json'
bad_batch2 = json.loads(bad_batch2_path.read_text(encoding='utf-8'))
assert [e['number'] for e in bad_batch2['episodes']] == list(range(1,17))
for episode in bad_batch2['episodes']:
    items.append({'id': episode['id'], 'title': title(episode['name']), 'seriesId': 'bad-batch', 'kind': 'episode', 'season': 2, 'episode': episode['number'], 'releaseDate': episode['airdate'], 'runtimeMinutes': None, 'runtimeNote': 'Runtime withheld pending edition-specific verification; same-day releases retain separate episode records.', 'sourceUrl': episode['sourceUrl']})
bad_batch3_path = ROOT / 'docs/bad-batch-season-3-source.json'
bad_batch3 = json.loads(bad_batch3_path.read_text(encoding='utf-8'))
assert [e['number'] for e in bad_batch3['episodes']] == list(range(1,16))
for episode in bad_batch3['episodes']:
    items.append({'id': episode['id'], 'title': title(episode['name']), 'seriesId': 'bad-batch', 'kind': 'episode', 'season': 3, 'episode': episode['number'], 'releaseDate': episode['airdate'], 'runtimeMinutes': None, 'runtimeNote': 'Runtime withheld pending edition-specific verification; same-day releases retain separate episode records.', 'sourceUrl': episode['sourceUrl']})
obi_wan_path = ROOT / 'docs/obi-wan-source.json'
obi_wan = json.loads(obi_wan_path.read_text(encoding='utf-8'))
assert [e['number'] for e in obi_wan['episodes']] == list(range(1,7))
for episode in obi_wan['episodes']:
    items.append({'id': episode['id'], 'title': title(episode['name']), 'seriesId': 'obi-wan', 'kind': 'episode', 'season': 1, 'episode': episode['number'], 'releaseDate': episode['airdate'], 'runtimeMinutes': None, 'runtimeNote': 'Runtime withheld pending edition-specific verification; shared premiere date retains separate episode records.', 'sourceUrl': episode['sourceUrl']})
items.sort(key=lambda item: (item['releaseDate'], item['seriesId'], item.get('season', 0), item.get('episode', 0), item['id']))
assert len(items) == 323, f'Expected 323 catalog items, got {len(items)}'
assert len(excluded) == 9, f'Expected 9 specials, got {len(excluded)}'
assert len({item['id'] for item in items}) == len(items), 'Duplicate catalog IDs'

def count_items(series, season=None):
    return sum(1 for item in items if item['seriesId'] == series and (season is None or item.get('season') == season))

rebels_records = count_items('rebels')
rebels_official_slots = 15 + 22 + 22 + 15  # official numbered slots per season (see extensionCollections)
assert sum(1 for i in items if i['kind'] == 'episode') == 315 and sum(1 for i in items if i['kind'] == 'film') == 8, 'Unexpected episode/film split'
assert rebels_records == 66, f'Expected 66 Rebels records, got {rebels_records}'
metadata = {
    'auditDate': '2026-11-07',
    'scope': f'Original trilogy; Andor seasons 1–2; The Clone Wars (2008) seasons 1–7 and film; The Mandalorian seasons 1–3; Ahsoka season 1; Rogue One; The Book of Boba Fett season 1; prequel trilogy; Rebels seasons 1–4 ({rebels_records} watch records covering {rebels_official_slots} official numbered slots); The Bad Batch seasons 1–3; Obi-Wan Kenobi six-part series.',
    'coreCount': len(items),
    'regularEpisodeCount': sum(1 for item in items if item['kind'] == 'episode'),
    'originalAuditCohortCount': original_cohort_count,
    'extensionCollections': [{'seriesId': 'obi-wan', 'count': count_items('obi-wan'), 'sourceFile': obi_wan_path.name, 'note': obi_wan['numberingNote']}, {'seriesId': 'bad-batch', 'season': 3, 'count': count_items('bad-batch', 3), 'sourceFile': bad_batch3_path.name, 'note': bad_batch3['numberingNote']}, {'seriesId': 'bad-batch', 'season': 2, 'count': count_items('bad-batch', 2), 'sourceFile': bad_batch2_path.name, 'note': bad_batch2['numberingNote']}, {'seriesId': 'bad-batch', 'season': 1, 'count': count_items('bad-batch', 1), 'sourceFile': bad_batch_path.name, 'note': bad_batch['numberingNote']}, {'seriesId': 'rebels', 'season': 4, 'count': count_items('rebels', 4), 'officialNumberedSlots': 15, 'sourceFile': rebels4_path.name, 'note': rebels4['numberingNote']}, {'seriesId': 'rebels', 'season': 3, 'count': count_items('rebels', 3), 'officialParts': 22, 'sourceFile': rebels3_path.name, 'note': rebels3['numberingNote']}, {'seriesId': 'rebels', 'season': 2, 'count': count_items('rebels', 2), 'officialParts': 22, 'sourceFile': rebels2_path.name, 'note': rebels2['numberingNote']}, {'seriesId': 'rebels', 'season': 1, 'count': count_items('rebels', 1), 'officialParts': 15, 'sourceFile': rebels_path.name, 'note': rebels['numberingNote']}, {'seriesId': 'pt', 'count': count_items('pt'), 'sourceFile': prequel_path.name, 'note': 'Three separately sourced prequel films; no edition-specific runtime claims.'}, {'seriesId': 'rogue-one', 'count': count_items('rogue-one'), 'sourceFile': rogue_path.name, 'note': 'Standalone film, separate from the original audit cohort.'}, {'seriesId': 'ahsoka', 'season': 1, 'count': count_items('ahsoka', 1), 'sourceFile': extension_path.name, 'note': 'Complete first season only; no season 2 future stubs.'}, {'seriesId': 'boba-fett', 'season': 1, 'count': count_items('boba-fett', 1), 'sourceFile': boba_path.name, 'note': 'Complete seven-chapter season; narrative order retains flashbacks.'}],
    'filmCount': sum(1 for item in items if item['kind'] == 'film'),
    'excludedSpecialCount': len(excluded),
    'chronologySupported': False,
    'chronologyNote': 'Catalog release dates are not story chronology. This catalog carries no story-order data: items have no storyOrder values and none are inferred. Viewing-sequence orders are supplied separately from this catalog metadata.',
    'episodeReleaseDateNote': 'TVmaze airdate field retained as reported; territorial release times are not normalized.',
    'filmReleaseDateNotes': {
        **{film['id']: film['releaseDate'] + ' from the official film landing page; territory and release type not explicitly specified.' for film in prequel['films']},
        'rogue-one': '2016-12-16 from the official film landing page; territory and release type not explicitly specified.',
        'ot-a-new-hope': 'SWAPI provider release date retained; no territory or release-type field was supplied.',
        'ot-empire-strikes-back': 'SWAPI 1980-05-17 retained as provider-reported date. Premiere versus theatrical release and territory remain unresolved; not a definitive worldwide release date.',
        'ot-return-of-the-jedi': 'SWAPI 1983-05-25 retained, supported by the official Jedi at 40 article. Official film landing page previously displayed conflicting May 1; release-type provenance still needs normalization.',
        'clone-wars-film': '2008-08-15 from official film landing page, checked 2026-11-07; territory not explicitly supplied in the extracted page.'
    },
    'filmDateSupportingSources': {'ot-return-of-the-jedi': 'https://www.starwars.com/news/jedi-at-40-deleted-scenes', 'clone-wars-film': 'https://www.starwars.com/films/star-wars-the-clone-wars'},
    'attribution': [{'provider': 'TVmaze', 'url': 'https://www.tvmaze.com/api', 'license': 'CC BY-SA', 'use': 'Episode titles, dates, numbering, runtime fields and source links; derived catalog fields preserve source attribution.'}, {'provider': 'SWAPI', 'url': 'https://swapi.dev/documentation', 'use': 'Three original-trilogy film titles and provider release dates from audited responses.'}],
    'sourceFiles': [{'name': p.name, 'sha256': hashlib.sha256(p.read_bytes().replace(b'\r\n', b'\n')).hexdigest()} for p in [episode_path, film_path, extension_path, rogue_path, boba_path, prequel_path, rebels_path, rebels2_path, rebels3_path, rebels4_path, bad_batch_path, bad_batch2_path, bad_batch3_path, obi_wan_path]],
    'excludedSpecials': excluded,
    'mediaNote': 'No summaries, poster URLs, episode images, or provider artwork included.'
}
destination = ROOT / 'src/catalog.generated.json'
destination.write_text(json.dumps({'metadata': metadata, 'items': items}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Built {len(items)} items, excluded {len(excluded)} specials: {destination}')

