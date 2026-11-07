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
parser.add_argument('--audit-dir', type=pathlib.Path, default=ROOT.parent)
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
items.sort(key=lambda item: (item['releaseDate'], item['seriesId'], item.get('season', 0), item.get('episode', 0), item['id']))
assert len(items) == 185, f'Expected 185 core items, got {len(items)}'
assert len(excluded) == 9, f'Expected 9 specials, got {len(excluded)}'
assert len({item['id'] for item in items}) == len(items), 'Duplicate catalog IDs'

metadata = {
    'auditDate': '2026-11-07',
    'scope': 'Original trilogy; Andor seasons 1–2; The Clone Wars (2008) seasons 1–7 and film; The Mandalorian seasons 1–3.',
    'coreCount': len(items),
    'regularEpisodeCount': 181,
    'filmCount': 4,
    'excludedSpecialCount': len(excluded),
    'chronologySupported': False,
    'chronologyNote': 'Catalog release dates are not story chronology. Official Clone Wars relative order was audited separately but is not imported here. No storyOrder values are inferred.',
    'episodeReleaseDateNote': 'TVmaze airdate field retained as reported; territorial release times are not normalized.',
    'filmReleaseDateNotes': {
        'ot-a-new-hope': 'SWAPI provider release date retained; no territory or release-type field was supplied.',
        'ot-empire-strikes-back': 'SWAPI 1980-05-17 retained as provider-reported date. Premiere versus theatrical release and territory remain unresolved; not a definitive worldwide release date.',
        'ot-return-of-the-jedi': 'SWAPI 1983-05-25 retained, supported by the official Jedi at 40 article. Official film landing page previously displayed conflicting May 1; release-type provenance still needs normalization.',
        'clone-wars-film': '2008-08-15 from official film landing page, checked 2026-11-07; territory not explicitly supplied in the extracted page.'
    },
    'filmDateSupportingSources': {'ot-return-of-the-jedi': 'https://www.starwars.com/news/jedi-at-40-deleted-scenes', 'clone-wars-film': 'https://www.starwars.com/films/star-wars-the-clone-wars'},
    'attribution': [{'provider': 'TVmaze', 'url': 'https://www.tvmaze.com/api', 'license': 'CC BY-SA', 'use': 'Episode titles, dates, numbering, runtime fields and source links; derived catalog fields preserve source attribution.'}, {'provider': 'SWAPI', 'url': 'https://swapi.dev/documentation', 'use': 'Three original-trilogy film titles and provider release dates from audited responses.'}],
    'sourceFiles': [{'name': p.name, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in [episode_path, film_path]],
    'excludedSpecials': excluded,
    'mediaNote': 'No summaries, poster URLs, episode images, or provider artwork included.'
}
destination = ROOT / 'src/catalog.generated.json'
destination.write_text(json.dumps({'metadata': metadata, 'items': items}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Built {len(items)} items, excluded {len(excluded)} specials: {destination}')
