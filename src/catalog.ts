import generated from './catalog.generated.json';

export type CatalogItem = {
  id: string;
  title: string;
  seriesId: string;
  kind: 'film' | 'episode';
  season?: number;
  episode?: number;
  releaseDate: string;
  runtimeMinutes: number | null;
  runtimeNote?: string;
  sourceUrl: string;
  /** Relative viewing order only when independently sourced; never inferred from release date. */
  storyOrder?: number;
};

export const SERIES = [
  { id: 'ot', title: 'Original trilogy', color: '#F2B96B' },
  { id: 'andor', title: 'Andor', color: '#E38167' },
  { id: 'clone-wars', title: 'The Clone Wars', color: '#65DBFF' },
  { id: 'ahsoka', title: 'Ahsoka · season 1', color: '#DAA2F2' },
  { id: 'mandalorian', title: 'The Mandalorian', color: '#9FCB85' },
] as const;

export const CATALOG = generated.items as CatalogItem[];
export const CATALOG_METADATA = generated.metadata;
