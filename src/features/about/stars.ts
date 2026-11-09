/*
 * The star chart beside the letter: the "teapot", the best-known pattern in the constellation of the archer, drawn from
 * the real positions of its stars. Six of them stand for the kinds of work we are building for, and the chart tells the
 * truth about where we are: some stars are lit (we have made a first thing there) and the rest are still dark (we are
 * listening, and nothing is built yet).
 *
 * Positions are in a 520 x 440 drawing. They come from each star's right ascension and declination (north is up and
 * right ascension grows to the left, as on a printed sky chart), scaled by 26 drawing units per degree of declination, with
 * right ascension scaled by cos(30°) so shapes are not stretched. The graticule ticks use the same scale.
 */

export const CHART = { w: 520, h: 440 };

export type ChartStar = {
  id: string;
  x: number;
  y: number;
  r: number;
  /** The star's real colour, from its spectral type: blue-white for the hot ones, orange for the cooler giants. */
  tint: string;
};

/** The eight stars of the teapot. Names are the traditional ones. */
export const CHART_STARS: ChartStar[] = [
  { id: 'nunki', x: 176, y: 126, r: 4.2, tint: '#cfdcff' }, // σ  Nunki, blue-white (B2.5)
  { id: 'kausBorealis', x: 330, y: 103, r: 3.8, tint: '#ffd9ae' }, // λ  Kaus Borealis, orange (K1)
  { id: 'alnasl', x: 454, y: 233, r: 3.8, tint: '#ffd4a0' }, // γ  Alnasl, orange (K0), the spout
  { id: 'ascella', x: 132, y: 220, r: 4.0, tint: '#f2f5ff' }, // ζ  Ascella, white (A2)
  { id: 'kausAustralis', x: 353, y: 337, r: 4.8, tint: '#d6e2ff' }, // ε  Kaus Australis, blue-white (B9.5), the brightest in the constellation
  { id: 'phi', x: 228, y: 145, r: 2.6, tint: '#cddcff' }, // φ  (B8.5)
  { id: 'tau', x: 114, y: 163, r: 2.6, tint: '#ffd9ae' }, // τ  (K1)
  { id: 'kausMedia', x: 369, y: 217, r: 3.2, tint: '#ffcf9a' }, // δ  Kaus Media, orange (K3), the heart of the teapot
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
  /** Roman numeral in the key to the plate. */
  numeral: string;
  /** What its name on the chart says. For the first five this matches `FOR_WHOM` (copy.ts). */
  label: string;
  /** The star that stands for it, and that star's traditional name. */
  starId: string;
  starName: string;
  /**
   * Whether we have made anything there yet. This must stay in step with the letter, which says we have built two small
   * things: exactly two fields are 'started'. Change a field to 'started' only when there is real work to point to.
   */
  status: 'started' | 'listening';
  /** A small, everyday example of the friction we want to take out of that kind of work. */
  friction: string;
  /** What exists there, or what does not, in plain words. */
  work: string;
  /** Where its name is written on the chart, and which way the text runs from that point. */
  labelAt: { x: number; y: number; anchor?: 'start' | 'middle' | 'end' };
};

const NOT_YET = 'Nothing built here yet. We would like to begin with you.';

export const FIELDS: Field[] = [
  {
    id: 'biology',
    numeral: 'I',
    label: 'Biology',
    starId: 'nunki',
    starName: 'Nunki',
    status: 'started',
    friction: 'The sequence file nobody can open.',
    work: 'First work: an AI that reads deep-sea DNA.',
    labelAt: { x: 176, y: 100 },
  },
  { id: 'physics', numeral: 'II', label: 'Physics', starId: 'kausBorealis', starName: 'Kaus Borealis', status: 'listening', friction: 'The unit that quietly did not convert.', work: NOT_YET, labelAt: { x: 330, y: 77 } },
  { id: 'chemistry', numeral: 'III', label: 'Chemistry', starId: 'alnasl', starName: 'Alnasl', status: 'listening', friction: 'The afternoon lost to reformatting.', work: NOT_YET, labelAt: { x: 436, y: 268 } },
  { id: 'mathematics', numeral: 'IV', label: 'Mathematics', starId: 'ascella', starName: 'Ascella', status: 'listening', friction: 'The proof you cannot quite check at 2 a.m.', work: NOT_YET, labelAt: { x: 132, y: 254 } },
  {
    id: 'companion',
    numeral: 'V',
    label: 'Companion',
    starId: 'kausMedia',
    starName: 'Kaus Media',
    status: 'started',
    friction: 'The question you were too tired to ask twice.',
    work: 'First work: a local AI assistant, a companion for researchers and students.',
    labelAt: { x: 386, y: 205, anchor: 'start' },
  },
  { id: 'everyday', numeral: 'VI', label: 'Cafés, shops & homes', starId: 'kausAustralis', starName: 'Kaus Australis', status: 'listening', friction: 'The small chores that were never the point.', work: NOT_YET, labelAt: { x: 353, y: 372 } },
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
