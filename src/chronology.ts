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
    id: 'bad-batch', title: 'The Bad Batch · season 1 narrative order',
    description: 'Follow sixteen numbered episodes from Order 66 into the early Empire. The extended premiere remains one watch record.',
    sourceUrl: 'https://www.starwars.com/series/star-wars-the-bad-batch',
    itemIds: numberedEpisodes('bad-batch', [16]),
    caveats: [
      'Season one only. Seasons two and three are outside this collection; provider dates and uncertain edition runtimes remain separate from narrative order.',
      'Aftermath depicts events around Order 66, overlapping Revenge of the Sith and the end of The Clone Wars. No exact scene-interleaving or BBY/ABY event calendar is asserted.',
      'Whole-work order is not a character journey. Ship settings, mentions, flashbacks and unresolved planet identities remain qualified in individual evidence records.',
    ],
  },
  {
    id: 'rebels', title: 'Rebels · seasons 1–4 narrative order',
    description: 'Follow all four seasons as 66 watch records covering 74 official numbered slots. Shared two-part guides retain combined progress records; the extended finale is numbered S04E15.',
    sourceUrl: 'https://www.starwars.com/series/star-wars-rebels',
    itemIds: ['rebels-s01e01', ...Array.from({length:13}, (_,i) => episodeId('rebels',1,i+3)), 'rebels-s02e01', ...Array.from({length:19}, (_,i) => episodeId('rebels',2,i+3)), ...[1,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21].map(n => episodeId('rebels',3,n)), ...[1,3,5,6,7,8,9,10,11,12,13,14,15].map(n => episodeId('rebels',4,n))],
    caveats: [
      'Spark of Rebellion covers official parts 1–2 in one watch record. There is intentionally no separate episode 2 progress item; subsequent official numbering is retained.',
      'Season two combines The Siege of Lothal (parts 1–2) and Twilight of the Apprentice (parts 21–22). Season three combines Steps Into Shadow (1–2), Ghosts of Geonosis (12–13) and Zero Hour (21–22). Season four combines Heroes of Mandalore (1–2) and In the Name of the Rebellion (3–4); Disney+ numbers the extended finale as 15, with no separate 16. Promotional specials remain excluded.',
      'Whole-work narrative order is not scene chronology or a continuous travel route. Andor and Rebels overlap broadly; no exact episode interleaving is inferred.',
    ],
  },
  {
    id: 'pt', title: 'Prequel trilogy · film narrative order',
    description: 'Follow Episodes I, II and III as complete films. The Clone Wars television sequence is a separate collection, not interleaved scene by scene.',
    sourceUrl: 'https://www.starwars.com/news/star-wars-movies-and-series-guide',
    itemIds: ['pt-phantom-menace', 'pt-attack-of-the-clones', 'pt-revenge-of-the-sith'],
    caveats: [
      'Film-level narrative order does not assign exact dates or a continuous character travel route.',
      'The final Clone Wars arc overlaps Revenge of the Sith. No official scene-interleaving order is asserted.',
      'Deleted scenes are excluded from appearance evidence for these film records; editions and runtime remain qualified.',
    ],
  },
  {
    id: 'boba-fett', title: 'The Book of Boba Fett · chapter narrative order',
    description: 'Follow all seven numbered chapters, keeping Boba’s memories and the Mandalorian interlude in their original presentation.',
    sourceUrl: 'https://www.starwars.com/series/the-book-of-boba-fett',
    itemIds: numberedEpisodes('boba-fett', [7]),
    caveats: [
      'Whole-episode narrative order, not scene chronology. Flashbacks and visions remain inside their chapters.',
      'Chapters 5–7 bridge The Mandalorian seasons 2 and 3 while retaining their Book of Boba Fett identity.',
      'Location coverage is partial. Luke’s school is retained as an unmapped site without an inferred planetary identity.',
    ],
  },
  {
    id: 'rogue-one', title: 'Rogue One · standalone film',
    description: 'The complete film connects Andor with A New Hope in the official viewing guide.',
    sourceUrl: 'https://www.starwars.com/news/star-wars-movies-and-series-guide',
    itemIds: ['rogue-one'],
    caveats: ['Whole-work viewing order only; the film’s earlier scenes remain inside the film.', 'No exact event dates, scene interleaving, or planet-to-planet travel order is implied.'],
  },
  {
    id: 'ahsoka',
    title: 'Ahsoka · season 1 narrative order',
    description: 'Follow the eight numbered parts of the complete first season, preserving visions and recalled battles inside their original episodes.',
    sourceUrl: 'https://www.starwars.com/series/ahsoka',
    itemIds: numberedEpisodes('ahsoka', [8]),
    caveats: [
      'Season 1 only; later seasons and announced episodes are outside this collection.',
      'Whole-episode narrative order is not event chronology. Visions of Clone Wars battles remain in Part Five, not moved into the Clone Wars sequence.',
      'Peridea is in another galaxy; this sequence supplies no map placement, travel distance, or exact in-universe dates.',
    ],
  },
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
  includedItemIds?: string[];
  description: string;
  sourceUrl: string;
};

/** External titles are references, not phantom catalog items or watch-progress entries. */
export const STORY_CONNECTIONS: StoryConnection[] = [
  {
    id: 'andor-rogue-one', sequenceId: 'andor', kind: 'bridge',
    afterItemId: 'andor-s02e12', beforeItemId: 'ot-a-new-hope',
    externalTitles: [], includedItemIds: ['rogue-one'],
    description: 'Rogue One follows the Andor finale and connects its story to A New Hope. The film is included as a separate collection; this bridge is whole-work viewing order, not exact event chronology.',
    sourceUrl: 'https://www.starwars.com/series/andor/season-2-episode-12-episode-guide',
  },
  {
    id: 'mandalorian-boba-fett', sequenceId: 'mandalorian', kind: 'bridge',
    afterItemId: 'mandalorian-s02e08', beforeItemId: 'mandalorian-s03e01',
    externalTitles: [],
    includedItemIds: ['boba-fett-s01e05', 'boba-fett-s01e06', 'boba-fett-s01e07'],
    description: 'These included Book of Boba Fett chapters provide Din and Grogu’s intervening story before The Mandalorian season 3. They retain their own series identity and watched progress; this is not a scene-by-scene chronology.',
    sourceUrl: 'https://www.starwars.com/news/this-is-the-way-the-mandalorian-season-3',
  },
  {
    id: 'clone-wars-revenge-of-the-sith', sequenceId: 'clone-wars', kind: 'overlap',
    itemIds: ['clone-wars-s07e09', 'clone-wars-s07e10', 'clone-wars-s07e11', 'clone-wars-s07e12'],
    externalTitles: [], includedItemIds: ['pt-revenge-of-the-sith'],
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
