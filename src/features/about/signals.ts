/*
 * The signals behind the instrument beside the letter. Each field we are building for has a signature signal, the kind
 * of trace its scientists look at every day, and friction is drawn as noise on top of it: a wandering baseline, jitter,
 * and spikes that come and go. Take the noise away and the signal, and what it means, is plain.
 *
 * These are illustrations of the shape of each signal, not measured data. The Balmer lines are at their true
 * wavelengths; everything else is drawn to look like the real thing.
 *
 * Everything here is plain maths on numbers from 0 to 1, so it can be tested without a browser.
 */

export type FieldId = 'biology' | 'physics' | 'chemistry' | 'mathematics' | 'companion';

export type ColourStop = { at: number; color: string };

export type Series = {
  color: string;
  /** Colours the line along its length instead of one flat colour (an indicator changing colour, a spectrum...). Stops run from 0 to 1 across the figure. */
  gradient?: ColourStop[];
  /** A dash pattern for a guide-like series, such as an envelope. */
  dash?: string;
  /** Line width in drawing units. */
  width?: number;
  /** False for a series that friction does not touch (a theoretical envelope). */
  noisy?: boolean;
  /** False for a series that has no shaded area under it. */
  fill?: boolean;
  /** The clean signal at position `x` (0 to 1), scaled so the tallest feature is about 1. `blur` (0 to 1) widens sharp features as friction rises. */
  at: (x: number, blur: number) => number;
};

export type Tick = { at: number; label: string };

export type Signal = {
  id: FieldId;
  /** The colour this field is drawn in, on the figure, the control and the list. */
  accent: string;
  /** Draw the visible spectrum as a strip along the bottom of the figure (for a spectrum, where position is wavelength). */
  spectrumStrip?: boolean;
  /** The figure's caption. */
  title: string;
  series: Series[];
  /** Words written on the signal, which become readable as the friction falls. `y` is the height to write them at. */
  labels: { x: number; y: number; text: string; color: string; anchor?: 'start' | 'middle' | 'end' }[];
  /** Vertical dashed guide lines, at positions from 0 to 1. */
  guides: number[];
  axes: { x: { title: string; ticks: Tick[] }; y: { title: string; ticks: Tick[] } };
};

const IVORY = '#ece4cc';

const bump = (x: number, centre: number, width: number) => Math.exp(-0.5 * ((x - centre) / width) ** 2);
const lorentz = (x: number, centre: number, width: number) => 1 / (1 + ((x - centre) / width) ** 2);

/* ───────── colour of light ───────── */

const toHex = (value: number) => Math.round(clamp01(value) * 255).toString(16).padStart(2, '0');
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** The colour the eye sees for light of this wavelength, in nanometres (after Dan Bruton's well-known approximation). */
export function wavelengthColor(wavelength: number): string {
  const w = wavelength;
  let r = 0;
  let g = 0;
  let b = 0;
  if (w >= 380 && w < 440) [r, g, b] = [-(w - 440) / 60, 0, 1];
  else if (w >= 440 && w < 490) [r, g, b] = [0, (w - 440) / 50, 1];
  else if (w >= 490 && w < 510) [r, g, b] = [0, 1, -(w - 510) / 20];
  else if (w >= 510 && w < 580) [r, g, b] = [(w - 510) / 70, 1, 0];
  else if (w >= 580 && w < 645) [r, g, b] = [1, -(w - 645) / 65, 0];
  else if (w >= 645 && w <= 780) [r, g, b] = [1, 0, 0];
  // the eye is less sensitive at the ends of the spectrum, so the colour fades there
  const fade = w < 420 ? 0.3 + (0.7 * (w - 380)) / 40 : w > 700 ? 0.3 + (0.7 * (780 - w)) / 80 : 1;
  const gamma = (c: number) => (c === 0 ? 0 : (c * fade) ** 0.8);
  return `#${toHex(gamma(r))}${toHex(gamma(g))}${toHex(gamma(b))}`;
}

/** Colour stops that run across the figure's wavelength axis (380 to 700 nm), brightened a little so they read on a dark screen. */
export function spectrumStops(from = 380, to = 700, steps = 32): ColourStop[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const at = i / steps;
    return { at, color: wavelengthColor(from + at * (to - from)) };
  });
}

/* ───────── biology: a sequencing trace, one colour for each of the four bases ───────── */

const READ = 'ACGTTGCAAGCT';
const PEAK_HEIGHTS = [0.82, 0.64, 0.93, 0.71, 0.58, 0.88, 0.69, 0.95, 0.6, 0.77, 0.9, 0.66];
const PEAK_AT = READ.split('').map((_, i) => 0.075 + i * 0.0775 + Math.sin(i * 3.1) * 0.006);
const BASE_COLOURS: Record<string, string> = { A: '#7fd1ae', C: '#7fa8e8', G: IVORY, T: '#e8836d' };

const baseSeries = (base: string): Series => ({
  color: BASE_COLOURS[base],
  at: (x, blur) => {
    let sum = 0;
    READ.split('').forEach((letter, i) => {
      if (letter === base) sum += PEAK_HEIGHTS[i] * bump(x, PEAK_AT[i], 0.0105 * (1 + 0.5 * blur));
    });
    return sum;
  },
});

/* ───────── physics: the visible lines of hydrogen (the Balmer series), at their true wavelengths ───────── */

const NM_FROM = 380;
const NM_TO = 700;
const nm = (wavelength: number) => (wavelength - NM_FROM) / (NM_TO - NM_FROM);
/** How bright each line's name is written: the colour of the line, lifted a little so it reads on a dark screen. */
const LINE_TEXT: Record<string, string> = { Hδ: '#c9a8ff', Hγ: '#8aa2ff', Hβ: '#6fe0f0', Hα: '#ff8a7a' };
const BALMER = [
  { name: 'Hδ', nm: 410.2, strength: 0.2 },
  { name: 'Hγ', nm: 434.0, strength: 0.3 },
  { name: 'Hβ', nm: 486.1, strength: 0.58 },
  { name: 'Hα', nm: 656.3, strength: 1 },
];

/* ───────── chemistry: a titration curve, with its equivalence point at 25 mL ───────── */

const titration = (x: number) => 0.12 + 0.76 * (0.5 + 0.5 * Math.tanh((x * 50 - 25) / 1.5)) + 0.0016 * (x * 50 - 25);

/* ───────── mathematics: sin(x) / x ───────── */

/** The upper bound of the curve, 1 / |x|, which is capped at 1 near the middle where the curve itself peaks. */
const envelope = (x: number) => 1 / Math.max(1, Math.abs(24 * (x - 0.5)));

const sinc = (x: number) => {
  const v = 24 * (x - 0.5);
  return Math.abs(v) < 1e-9 ? 1 : Math.sin(v) / v;
};

/* ───────── a companion: the waveform of a question, then an answer ───────── */

const voice = (x: number) => 0.5 + 0.42 * (bump(x, 0.27, 0.075) * Math.sin(2 * Math.PI * 34 * x) + bump(x, 0.67, 0.13) * Math.sin(2 * Math.PI * 24 * x));

export const SIGNALS: Signal[] = [
  {
    id: 'biology',
    accent: '#7fd1ae',
    title: 'Sequence trace',
    series: ['A', 'C', 'G', 'T'].map(baseSeries),
    labels: READ.split('').map((letter, i) => ({ x: PEAK_AT[i], y: PEAK_HEIGHTS[i] + 0.075, text: letter, color: BASE_COLOURS[letter] })),
    guides: [],
    axes: {
      x: { title: 'Position in the read (bases)', ticks: [0, 1, 2, 3, 4].map((i) => ({ at: i / 4, label: String(i * 100) })) },
      y: { title: 'Signal (a.u.)', ticks: [{ at: 0, label: '0' }, { at: 0.5, label: '' }, { at: 1, label: '1' }] },
    },
  },
  {
    id: 'physics',
    accent: '#6fd3ff',
    spectrumStrip: true,
    title: 'Emission spectrum of hydrogen',
    // The trace is coloured by wavelength along its length, so each line has the colour that light really has.
    series: [
      {
        color: '#ffffff',
        gradient: spectrumStops(),
        width: 1.6,
        at: (x, blur) => 0.09 + 0.9 * BALMER.reduce((sum, line) => sum + line.strength * lorentz(x, nm(line.nm), 0.0035 * (1 + 3 * blur)), 0),
      },
    ],
    labels: BALMER.map((line) => ({
      x: nm(line.nm),
      y: line.name === 'Hα' ? 0.9 : line.strength * 0.9 + 0.17,
      text: line.name,
      color: LINE_TEXT[line.name],
      anchor: line.name === 'Hα' ? ('end' as const) : ('middle' as const),
    })),
    guides: [],
    axes: {
      x: { title: 'Wavelength (nm)', ticks: [400, 450, 500, 550, 600, 650, 700].map((value) => ({ at: nm(value), label: String(value) })) },
      y: { title: 'Intensity (a.u.)', ticks: [{ at: 0, label: '0' }, { at: 0.5, label: '' }, { at: 1, label: '1' }] },
    },
  },
  {
    id: 'chemistry',
    accent: '#f2b94a',
    title: 'Titration curve',
    // Like the indicator in the flask, the curve changes colour as it passes the equivalence point: acid, neutral, base.
    series: [
      {
        color: '#f2b94a',
        gradient: [
          { at: 0, color: '#f2b94a' },
          { at: 0.42, color: '#f2b94a' },
          { at: 0.5, color: '#56d39b' },
          { at: 0.58, color: '#5b8fff' },
          { at: 1, color: '#5b8fff' },
        ],
        width: 1.7,
        at: (x) => titration(x),
      },
    ],
    labels: [{ x: 0.53, y: 0.3, text: 'equivalence point', color: '#8ee6bd', anchor: 'start' }],
    guides: [0.5],
    axes: {
      x: { title: 'Volume of base added (mL)', ticks: [0, 10, 20, 30, 40, 50].map((value) => ({ at: value / 50, label: String(value) })) },
      y: { title: 'pH', ticks: [{ at: 0.12, label: '2' }, { at: 0.5, label: '7' }, { at: 0.88, label: '12' }] },
    },
  },
  {
    id: 'mathematics',
    accent: '#b79cff',
    title: 'sin(x) / x',
    series: [
      {
        color: '#d17aff',
        gradient: [
          { at: 0, color: '#7b8cff' },
          { at: 0.35, color: '#a587ff' },
          { at: 0.5, color: '#ff7ac8' },
          { at: 0.65, color: '#a587ff' },
          { at: 1, color: '#7b8cff' },
        ],
        width: 1.7,
        at: (x) => (sinc(x) + 0.22) / 1.22,
      },
      // the envelope the curve can never leave: |sin(x) / x| is never more than 1 / |x|
      { color: '#b79cff', dash: '3 4', width: 0.9, noisy: false, fill: false, at: (x) => (envelope(x) + 0.22) / 1.22 },
    ],
    labels: [
      { x: 0.5, y: 1.07, text: 'x = 0', color: '#ffb3e0' },
      { x: 0.84, y: 0.42, text: '1 / |x|', color: '#c9b8ff' },
    ],
    guides: [0.5],
    axes: {
      x: { title: 'x', ticks: [-12, -6, 0, 6, 12].map((value) => ({ at: (value + 12) / 24, label: String(value).replace('-', '−') })) },
      y: { title: 'sin(x) / x', ticks: [{ at: 0.22 / 1.22, label: '0' }, { at: 1, label: '1' }] },
    },
  },
  {
    id: 'companion',
    accent: '#ff9d8a',
    title: 'A question, then an answer',
    // Two voices, two colours: the question, then the answer.
    series: [
      {
        color: '#ff9d8a',
        gradient: [
          { at: 0, color: '#ff9d8a' },
          { at: 0.46, color: '#ff9d8a' },
          { at: 0.5, color: '#4fd1c5' },
          { at: 1, color: '#4fd1c5' },
        ],
        width: 1.3,
        at: (x) => voice(x),
      },
    ],
    labels: [
      { x: 0.27, y: 1.0, text: 'a question', color: '#ffb8a9' },
      { x: 0.67, y: 1.0, text: 'an answer', color: '#7fe3d8' },
    ],
    guides: [],
    axes: {
      x: { title: 'Time (s)', ticks: [0, 2, 4, 6, 8].map((value) => ({ at: value / 8, label: String(value) })) },
      y: { title: 'Amplitude', ticks: [{ at: 0.5, label: '0' }] },
    },
  },
];

/* ───────── friction ───────── */

/**
 * The noise that friction adds, for one trace at position `x` and time `t`. `friction` runs from 0 (none: exactly 0 is
 * returned) to 1 (a lot). It is a slow wandering baseline, a fine jitter, and a few spikes that come and go.
 */
export function frictionNoise(x: number, t: number, friction: number, seed: number): number {
  if (friction <= 0) return 0;
  const wander = 0.5 * Math.sin(x * 5.1 + t * 0.9 + seed) + 0.3 * Math.sin(x * 11.7 - t * 0.6 + seed * 2.3) + 0.4 * Math.sin(x * 2.3 + t * 0.35 + seed * 0.7);
  const jitter = Math.sin(x * 83 + t * 7.1 + seed) * Math.sin(x * 57 - t * 5.3 + seed * 1.7);
  let spikes = 0;
  for (let k = 0; k < 6; k++) {
    const where = 0.06 + ((k * 0.37 + seed * 0.11) % 0.88);
    const size = 0.3 + ((k * 53) % 7) / 7;
    const alive = Math.max(0, Math.sin(t * 1.7 + k * 2.1 + seed)) ** 3;
    spikes += size * alive * bump(x, where, 0.004);
  }
  return friction * (0.2 * wander + 0.09 * jitter + 0.5 * spikes);
}

/** A tiny static picture of each signal, for the list: the signal with no friction, as an SVG path in a width x height box. */
export function sparkPath(signal: Signal, width: number, height: number, steps = 72): string {
  const pad = 2;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const y = Math.min(1.05, Math.max(0, Math.max(...signal.series.filter((series) => series.fill !== false).map((series) => series.at(x, 0)))));
    points.push(`${(x * width).toFixed(1)} ${(pad + (height - 2 * pad) * (1 - y)).toFixed(1)}`);
  }
  return `M${points.join('L')}`;
}
