/** Reviewed setting information, never episode appearances, travel order or cartography. */
export type DatabankFact = { label: string; text: string; sourceUrl: string };
export type DatabankConnection = {
  id: string; name: string;
  kind: 'character' | 'species' | 'creature' | 'ship' | 'vehicle' | 'place' | 'affiliation' | 'equipment' | 'inhabitant';
  summary: string; sourceUrl: string;
};
export type DatabankMedia = {
  id: string; title: string; kind: 'video' | 'gallery'; url: string; sourceUrl: string;
  fallbackUrl: string; credit: string; useBasis: string; imageCount?: number;
};
export type DatabankGuide = {
  worldId: string; sourceUrl: string; checkedAt: string;
  environment: DatabankFact[]; connections: DatabankConnection[]; media: DatabankMedia[];
};
const bank = 'https://www.starwars.com/databank/';
const video = 'https://www.starwars.com/video/';
const connection = (id: string, name: string, kind: DatabankConnection['kind'], summary: string, slug = id): DatabankConnection => ({ id, name, kind, summary, sourceUrl: bank + slug });
const media = (world: string, id: string, title: string): DatabankMedia => ({
  id, title, kind: 'video', url: video + id, sourceUrl: bank + world, fallbackUrl: bank + world,
  credit: 'StarWars.com / Lucasfilm Ltd.',
  useBasis: 'Link to the official viewing page only; no video or thumbnail is copied or embedded.',
});
export const DATABANK_GUIDES: Readonly<Record<string, DatabankGuide>> = {
  serenno: {
    worldId: 'serenno', sourceUrl: bank + 'serenno', checkedAt: '2026-11-09',
    environment: [
      { label: 'Terrain', text: 'Mountains and plains are listed terrain types. Forests surround the cliffs described in the official entry.', sourceUrl: bank + 'serenno' },
      { label: 'Climate', text: 'The reviewed entry does not specify a climate classification.', sourceUrl: bank + 'serenno' },
    ],
    connections: [
      connection('confederacy-of-independent-systems', 'Confederacy of Independent Systems', 'affiliation', 'The world entry lists Separatist affiliation and describes a defensive cordon of Separatist warships.', 'serenno'),
      connection('count-dooku', 'Count Dooku', 'character', 'Serenno is Dooku’s ancestral homeworld. His individual entry also lists Serenno as a location.'),
      connection('dooku-palace', 'Dooku’s palace', 'place', 'Dooku established his base in a cliffside palace overlooking his homeworld’s forests.', 'serenno'),
      connection('the-box', 'The Box', 'equipment', 'Moralo Eval designed this dangerous simulator, housed inside Dooku’s palace on Serenno.'),
    ],
    media: [
      media('serenno', 'savage-s-training', 'Savage’s Training'),
      media('serenno', 'the-box', 'The Box'),
      media('serenno', 'eliminate-her', 'Eliminate Her'),
      media('serenno', 'dooku-attacked-by-nightsisters', 'Dooku Attacked by Nightsisters'),
      { id: 'serenno-history', title: 'Serenno History Gallery', kind: 'gallery', url: bank + 'serenno', sourceUrl: bank + 'serenno', fallbackUrl: bank + 'serenno', imageCount: 15, credit: 'StarWars.com / Lucasfilm Ltd.', useBasis: 'Link to the gallery within the official entry only; no gallery images are redistributed.' },
    ],
  },
  naboo: {
    worldId: 'naboo', sourceUrl: bank + 'naboo', checkedAt: '2026-11-09',
    environment: [
      { label: 'Climate', text: 'The official entry classifies Naboo’s climate as temperate.', sourceUrl: bank + 'naboo' },
      { label: 'Terrain', text: 'Hills, plains, swamps and urban terrain are listed. Lakes and river cities contrast with underwater settlements.', sourceUrl: bank + 'naboo' },
    ],
    connections: [
      connection('galactic-republic', 'Galactic Republic', 'affiliation', 'The Naboo world entry lists the Republic among its affiliations.', 'naboo'),
      connection('padme-amidala', 'Padmé Amidala', 'character', 'Padmé served first as Naboo’s elected Queen and later as its Senator.'),
      connection('human-naboo', 'Human Naboo', 'inhabitant', 'Human communities inhabit Naboo alongside the indigenous Gungans.', 'naboo'),
      connection('gungan', 'Gungans', 'species', 'Indigenous amphibious inhabitants of Naboo with their own advanced technology.'),
      connection('kaadu', 'Kaadu', 'creature', 'Native wingless avians domesticated by Gungans as mounts.'),
      connection('fambaa', 'Fambaa', 'creature', 'Large cargo animals used by the Gungan Grand Army to transport shield-generator components; also recorded on Onderon.'),
      connection('theed-royal-palace', 'Theed Royal Palace', 'place', 'The seat of Naboo’s elected monarchs overlooks the capital’s cliffs and waterfalls.'),
      connection('otoh-gunga', 'Otoh Gunga', 'place', 'A Gungan city beneath Lake Paonga, with breathable spaces enclosed by hydrostatic bubbles.'),
      connection('naboo-n-1-starfighter', 'Naboo N-1 Starfighter', 'ship', 'A starfighter used to protect the skies and space around Naboo.'),
      connection('naboo-royal-starship', 'Naboo Royal Starship', 'ship', 'An unarmed royal vessel equipped with shields and a hyperdrive.'),
      connection('gian-speeder', 'Gian Speeder', 'vehicle', 'A repulsorlift vehicle used by Naboo’s volunteer security force for urban defense and crowd control.'),
      connection('gungan-bongo-submarine', 'Gungan Bongo Submarine', 'vehicle', 'An organically grown submarine used for travel through Naboo’s waters.'),
    ],
    media: [media('naboo', 'whats-this', 'What’s This?'), media('naboo', 'our-fate-is-in-your-hands', 'Our Fate is in Your Hands')],
  },
};
