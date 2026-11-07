/**
 * Reviewed relative viewing sequences, checked 2026-11-07.
 * These are collection-local paths through whole works, not a global event calendar.
 * Release dates never determine these positions. No exact BBY/ABY dates are asserted.
 */
export type StorySequence = {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  itemIds: string[];
  caveats: string[];
};

const episodeId = (series: string, season: number, episode: number) =>
  `${series}-s${String(season).padStart(2, '0')}e${String(episode).padStart(2, '0')}`;

/** Numbered episode narrative order, deliberately independent of releaseDate. */
const numberedEpisodes = (series: string, seasonCounts: number[]) =>
  seasonCounts.flatMap((count, index) =>
    Array.from({ length: count }, (_, episode) => episodeId(series, index + 1, episode + 1)),
  );

// Official chronological table: season+episode codes. T is its separate theatrical film row.
// Verified 133 unique episode codes, plus T. Legacy story reels are not members of this table.
const cloneWarsCodes = `
216 116 T 301 303 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115
117 118 119 120 121 201 202 203 217 218 219 204 205 206 207 208 209 210 211 212
213 214 220 221 222 305 306 307 302 304 308 122 309 310 311 215 312 313 314 315
316 317 318 319 320 321 322 401 402 403 404 405 406 407 408 409 410 411 412 413
414 415 416 417 418 419 420 421 422 502 503 504 505 506 507 508 509 510 511 512
513 501 514 515 516 517 518 519 520 601 602 603 604 605 606 607 608 609 610 611
612 613 705 706 707 708 701 702 703 704 709 710 711 712
`.trim().split(/\s+/);

export const STORY_SEQUENCES: StorySequence[] = [
  {
    id: 'clone-wars',
    title: 'The Clone Wars · official chronological order',
    description: 'The official whole-episode viewing sequence, including the 2008 theatrical film: 134 stories across the Clone Wars.',
    sourceUrl: 'https://www.starwars.com/news/star-wars-the-clone-wars-chronological-episodeorder',
    itemIds: cloneWarsCodes.map(code => code === 'T'
      ? 'clone-wars-film'
      : episodeId('clone-wars', Number(code[0]), Number(code.slice(1)))),
    caveats: [
      'Relative viewing order only. Sequence numbers are not in-universe years or event timestamps.',
      'The theatrical film follows S2E16 and S1E16. Season 7 episodes 5–8 precede episodes 1–4.',
      'The final arc overlaps Revenge of the Sith, which is outside this collection. No scene-by-scene interleaving is implied.',
      'Legacy story reels and other specials remain excluded from the completed film-and-episode collection.',
    ],
  },
  {
    id: 'andor',
    title: 'Andor · episode narrative order',
    description: 'Follow the numbered episodes of seasons 1–2. This preserves the series’ intended narrative presentation rather than sorting its flashbacks into the past.',
    sourceUrl: 'https://www.starwars.com/series/andor',
    itemIds: numberedEpisodes('andor', [12, 12]),
    caveats: [
      'Episode narrative order is not a complete event chronology: childhood sequences and other flashbacks remain inside their original episodes.',
      'Season 2 uses four three-episode arcs separated by years; individual episodes are not evenly spaced across the timeline.',
      'Rogue One connects the Andor finale to A New Hope. That film is an outside-collection bridge, not a missing Andor episode.',
    ],
  },
  {
    id: 'ot',
    title: 'Original trilogy · film narrative order',
    description: 'Follow Episodes IV, V, and VI as complete films: A New Hope, The Empire Strikes Back, then Return of the Jedi.',
    sourceUrl: 'https://www.starwars.com/news/star-wars-movies-and-series-guide',
    itemIds: ['ot-a-new-hope', 'ot-empire-strikes-back', 'ot-return-of-the-jedi'],
    caveats: [
      'This is film-level narrative order, not a timestamped sequence of simultaneous scenes or journeys.',
      'These three films do not constitute the full Star Wars chronology. Exact in-universe years are not assigned by this sequence.',
    ],
  },
  {
    id: 'mandalorian',
    title: 'The Mandalorian · episode narrative order',
    description: 'Follow the numbered episodes of seasons 1–3, with a clearly marked cross-series connection between seasons 2 and 3.',
    sourceUrl: 'https://www.starwars.com/series/the-mandalorian',
    itemIds: numberedEpisodes('mandalorian', [8, 8, 8]),
    caveats: [
      'Episode narrative order retains flashbacks in their original presentation; it does not place every scene at the episode’s present-day setting.',
      'The Book of Boba Fett chapters 5–7 provide a bridge between season 2 and season 3. Those episodes are outside this collection.',
      'Later-season exact years and elapsed travel times are not assigned. This sequence does not include The Mandalorian and Grogu film.',
    ],
  },
];

export type StoryConnection = {
  id: string;
  sequenceId: string;
  kind: 'bridge' | 'overlap';
  afterItemId?: string;
  beforeItemId?: string;
  itemIds?: string[];
  externalTitles: string[];
  description: string;
  sourceUrl: string;
};

/** External titles are references, not phantom catalog items or watch-progress entries. */
export const STORY_CONNECTIONS: StoryConnection[] = [
  {
    id: 'andor-rogue-one', sequenceId: 'andor', kind: 'bridge',
    afterItemId: 'andor-s02e12', beforeItemId: 'ot-a-new-hope',
    externalTitles: ['Rogue One: A Star Wars Story'],
    description: 'Rogue One follows the Andor finale and connects its story to A New Hope. It is not included in the current 185-item collection.',
    sourceUrl: 'https://www.starwars.com/series/andor/season-2-episode-12-episode-guide',
  },
  {
    id: 'mandalorian-boba-fett', sequenceId: 'mandalorian', kind: 'bridge',
    afterItemId: 'mandalorian-s02e08', beforeItemId: 'mandalorian-s03e01',
    externalTitles: [
      'The Book of Boba Fett · Chapter 5: Return of the Mandalorian',
      'The Book of Boba Fett · Chapter 6: From the Desert Comes a Stranger',
      'The Book of Boba Fett · Chapter 7: In the Name of Honor',
    ],
    description: 'These outside-collection episodes provide Din and Grogu’s intervening story before The Mandalorian season 3. They retain their own series identity.',
    sourceUrl: 'https://www.starwars.com/news/this-is-the-way-the-mandalorian-season-3',
  },
  {
    id: 'clone-wars-revenge-of-the-sith', sequenceId: 'clone-wars', kind: 'overlap',
    itemIds: ['clone-wars-s07e09', 'clone-wars-s07e10', 'clone-wars-s07e11', 'clone-wars-s07e12'],
    externalTitles: ['Star Wars: Revenge of the Sith'],
    description: 'The final arc intersects Revenge of the Sith. The official discussion explicitly aligns Shattered with film events; this is an overlap annotation, not an official scene-interleaving watch order.',
    sourceUrl: 'https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-shattered',
  },
];

export const CHRONOLOGY_SOURCES = [
  { label: 'Andor season-two year-separated arcs', url: 'https://www.starwars.com/news/andor-cast-interview' },
  { label: 'Andor childhood flashbacks', url: 'https://www.starwars.com/series/andor/andor-season-1-episode-1-episode-guide' },
  { label: 'The Mandalorian Order 66 flashback', url: 'https://www.starwars.com/news/mando-download-chapter-20-the-foundling' },
  { label: 'Book of Boba Fett chapter 5', url: 'https://www.starwars.com/series/the-book-of-boba-fett/chapter-5-return-of-the-mandalorian-episode-guide' },
  { label: 'Book of Boba Fett chapter 6', url: 'https://www.starwars.com/news/the-book-of-boba-fett-chapter-6-highlights' },
  { label: 'Book of Boba Fett chapter 7', url: 'https://www.starwars.com/series/the-book-of-boba-fett/chapter-7-in-the-name-of-honor-episode-guide' },
];
