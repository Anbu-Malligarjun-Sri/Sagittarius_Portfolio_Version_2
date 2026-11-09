/*
 * The star chart beside the letter: the "teapot", the best-known pattern in the constellation of the archer, drawn from
 * the real positions of its stars. Five of them stand for the five kinds of work we are building for.
 *
 * Positions are in a 520 x 440 drawing. They come from each star's right ascension and declination (north is up and
 * right ascension grows to the left, as on a printed sky chart), scaled by 26 drawing units per degree of declination, with
 * right ascension scaled by cos(30°) so shapes are not stretched. The graticule ticks use the same scale.
 */

export const CHART = { w: 520, h: 440 };

export type ChartStar = { id: string; x: number; y: number; r: number };

/** The eight stars of the teapot. Names are the traditional ones. */
export const CHART_STARS: ChartStar[] = [
  { id: 'nunki', x: 176, y: 126, r: 4.2 }, // σ  Nunki
  { id: 'kausBorealis', x: 330, y: 103, r: 3.8 }, // λ  Kaus Borealis (the lid)
  { id: 'alnasl', x: 454, y: 233, r: 3.8 }, // γ  Alnasl (the spout)
  { id: 'ascella', x: 132, y: 220, r: 4.0 }, // ζ  Ascella
  { id: 'kausAustralis', x: 353, y: 337, r: 4.8 }, // ε  Kaus Australis, the brightest star in the constellation
  { id: 'phi', x: 228, y: 145, r: 2.6 }, // φ
  { id: 'tau', x: 114, y: 163, r: 2.6 }, // τ
  { id: 'kausMedia', x: 369, y: 217, r: 3.2 }, // δ  Kaus Media
];

/** The lines that make the teapot. */
export const CHART_EDGES: [string, string][] = [
  ['kausBorealis', 'kausMedia'],
  ['kausBorealis', 'phi'],
  ['kausMedia', 'alnasl'],
  ['kausMedia', 'kausAustralis'],
  ['kausMedia', 'phi'],
  ['phi', 'nunki'],
  ['nunki', 'tau'],
  ['tau', 'ascella'],
  ['ascella', 'kausAustralis'],
];

export type Field = {
  id: string;
  /** Matches the names in `FOR_WHOM` (copy.ts). */
  label: string;
  /** The star that stands for it, and that star's traditional name. */
  starId: string;
  starName: string;
  /** A small, everyday example of the friction we want to take out of that kind of work. */
  friction: string;
  /** Where its name is written on the chart. */
  labelAt: { x: number; y: number };
};

export const FIELDS: Field[] = [
  { id: 'biology', label: 'Biology', starId: 'nunki', starName: 'Nunki', friction: 'The sequence file nobody can open.', labelAt: { x: 176, y: 100 } },
  { id: 'physics', label: 'Physics', starId: 'kausBorealis', starName: 'Kaus Borealis', friction: 'The unit that quietly did not convert.', labelAt: { x: 330, y: 77 } },
  { id: 'chemistry', label: 'Chemistry', starId: 'alnasl', starName: 'Alnasl', friction: 'The afternoon lost to reformatting.', labelAt: { x: 436, y: 268 } },
  { id: 'mathematics', label: 'Mathematics', starId: 'ascella', starName: 'Ascella', friction: 'The proof you cannot quite check at 2 a.m.', labelAt: { x: 132, y: 254 } },
  { id: 'everyday', label: 'Cafés, shops & homes', starId: 'kausAustralis', starName: 'Kaus Australis', friction: 'The small chores that were never the point.', labelAt: { x: 353, y: 372 } },
];

/** Right ascension and declination marks round the edge of the chart. */
export const RA_TICKS = [
  { x: 149, label: '19h' },
  { x: 318.5, label: '18h30m' },
  { x: 488, label: '18h' },
];
export const DEC_TICKS = [
  { y: 92.6, label: '−25°' },
  { y: 222.6, label: '−30°' },
  { y: 352.6, label: '−35°' },
];

/** The path of the Sun across the sky, which crosses this part of it. */
export const ECLIPTIC = 'M488 51Q270 40 40 31';
