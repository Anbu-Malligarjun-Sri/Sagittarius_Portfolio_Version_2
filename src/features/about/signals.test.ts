import { describe, expect, it } from 'vitest';
import { frictionNoise, SIGNALS, sparkPath, spectrumStops, wavelengthColor } from './signals';

const grid = Array.from({ length: 601 }, (_, i) => i / 600);
const signal = (id: string) => SIGNALS.find((s) => s.id === id)!;
const argmax = (values: number[]) => values.indexOf(Math.max(...values));

describe('the signals', () => {
  it('are finite and stay near the 0 to 1 box at every position and every level of friction', () => {
    for (const s of SIGNALS) {
      for (const series of s.series) {
        for (const blur of [0, 0.5, 1]) {
          for (const x of grid) {
            const y = series.at(x, blur);
            expect(Number.isFinite(y)).toBe(true);
            expect(y).toBeGreaterThanOrEqual(-0.05);
            expect(y).toBeLessThanOrEqual(1.1);
          }
        }
      }
    }
  });

  it('draw a DNA read of twelve peaks, in four colours', () => {
    const biology = signal('biology');
    expect(new Set(biology.series.map((series) => series.color)).size).toBe(4);
    let peaks = 0;
    for (const series of biology.series) {
      const ys = grid.map((x) => series.at(x, 0));
      for (let i = 1; i < ys.length - 1; i++) if (ys[i] > 0.3 && ys[i] >= ys[i - 1] && ys[i] > ys[i + 1]) peaks += 1;
    }
    expect(peaks).toBe(12);
    expect(biology.labels.map((l) => l.text).join('')).toBe('ACGTTGCAAGCT');
  });

  it('put the hydrogen lines at their true wavelengths', () => {
    const physics = signal('physics');
    const ys = grid.map((x) => physics.series[0].at(x, 0));
    const nmAt = (x: number) => 380 + x * 320;
    // the strongest line is H-alpha, at 656.3 nm
    expect(nmAt(grid[argmax(ys)])).toBeGreaterThan(655);
    expect(nmAt(grid[argmax(ys)])).toBeLessThan(657.5);
    // and H-beta, at 486.1 nm, is a local peak
    const near = grid.map((x, i) => ({ x, y: ys[i] })).filter(({ x }) => Math.abs(nmAt(x) - 486.1) < 6);
    expect(nmAt(near.reduce((a, b) => (b.y > a.y ? b : a)).x)).toBeGreaterThan(485);
    expect(nmAt(near.reduce((a, b) => (b.y > a.y ? b : a)).x)).toBeLessThan(487.5);
  });

  it('draw a titration curve that only rises, steepest at the equivalence point', () => {
    const ys = grid.map((x) => signal('chemistry').series[0].at(x, 0));
    for (let i = 1; i < ys.length; i++) expect(ys[i]).toBeGreaterThanOrEqual(ys[i - 1]);
    const slopes = ys.slice(1).map((y, i) => y - ys[i]);
    expect(grid[argmax(slopes)]).toBeGreaterThan(0.48);
    expect(grid[argmax(slopes)]).toBeLessThan(0.52);
  });

  it('draw sin(x)/x with its peak at x = 0, in the middle', () => {
    const ys = grid.map((x) => signal('mathematics').series[0].at(x, 0));
    expect(grid[argmax(ys)]).toBeCloseTo(0.5, 2);
    expect(ys[argmax(ys)]).toBeCloseTo(1, 2);
  });

  it('give each field a figure title, axes with ticks, and a different series', () => {
    expect(SIGNALS.map((s) => s.id)).toEqual(['biology', 'physics', 'chemistry', 'mathematics', 'companion']);
    for (const s of SIGNALS) {
      expect(s.title.length).toBeGreaterThan(5);
      expect(s.axes.x.title.length).toBeGreaterThan(0);
      expect(s.axes.x.ticks.length).toBeGreaterThan(1);
      for (const tick of [...s.axes.x.ticks, ...s.axes.y.ticks]) {
        expect(tick.at).toBeGreaterThanOrEqual(0);
        expect(tick.at).toBeLessThanOrEqual(1.001);
      }
      for (const label of s.labels) {
        expect(label.x).toBeGreaterThan(0);
        expect(label.x).toBeLessThan(1);
      }
    }
  });
});

describe('friction', () => {
  it('adds nothing at all when there is none', () => {
    for (const x of grid) for (const t of [0, 3.3, 99]) expect(frictionNoise(x, t, 0, 1.7)).toBe(0);
  });

  it('adds more as there is more, but never so much that the signal is lost', () => {
    let low = 0;
    let high = 0;
    for (const x of grid) {
      low = Math.max(low, Math.abs(frictionNoise(x, 2.1, 0.2, 0.4)));
      high = Math.max(high, Math.abs(frictionNoise(x, 2.1, 1, 0.4)));
      expect(Math.abs(frictionNoise(x, 2.1, 1, 0.4))).toBeLessThan(0.7);
    }
    expect(high).toBeGreaterThan(low * 2);
  });

  it('is different on each trace, and changes with time', () => {
    expect(frictionNoise(0.4, 1, 1, 0.3)).not.toBe(frictionNoise(0.4, 1, 1, 1.9));
    expect(frictionNoise(0.4, 1, 1, 0.3)).not.toBe(frictionNoise(0.4, 2.5, 1, 0.3));
  });
});

describe('the small pictures in the list', () => {
  it('are a single path inside their box', () => {
    for (const s of SIGNALS) {
      const d = sparkPath(s, 96, 24);
      expect(d.startsWith('M')).toBe(true);
      const ys = [...d.matchAll(/[\d.]+ ([\d.]+)/g)].map((m) => Number(m[1]));
      expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
      expect(Math.max(...ys)).toBeLessThanOrEqual(24);
    }
  });
});

describe('colour: every field is drawn in its own', () => {
  it('has a different accent colour for each field', () => {
    const accents = SIGNALS.map((s) => s.accent);
    expect(accents.every((c) => /^#[0-9a-f]{6}$/i.test(c))).toBe(true);
    expect(new Set(accents).size).toBe(SIGNALS.length);
  });

  it('never draws two different fields with the same line colours', () => {
    const key = (s: (typeof SIGNALS)[number]) => s.series.map((x) => (x.gradient ? x.gradient.map((g) => g.color).join('') : x.color)).join('|');
    expect(new Set(SIGNALS.map(key)).size).toBe(SIGNALS.length);
  });

  it('colours the chemistry curve like an indicator: acid, neutral, then base', () => {
    const stops = SIGNALS.find((s) => s.id === 'chemistry')!.series[0].gradient!;
    expect(stops[0].color).not.toBe(stops[stops.length - 1].color);
    const middle = stops.find((g) => g.at === 0.5)!;
    expect(middle.color).not.toBe(stops[0].color);
    expect(middle.color).not.toBe(stops[stops.length - 1].color);
  });

  it('gives each voice in the companion its own colour', () => {
    const stops = SIGNALS.find((s) => s.id === 'companion')!.series[0].gradient!;
    expect(stops[0].color).not.toBe(stops[stops.length - 1].color);
  });
});

describe('the colour of light', () => {
  const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

  it('is red at 656 nm (hydrogen alpha), blue-green at 486 nm (beta), and violet at 410 nm (delta)', () => {
    const [r1, g1, b1] = channels(wavelengthColor(656.3));
    expect(r1).toBeGreaterThan(200);
    expect(g1).toBeLessThan(40);
    expect(b1).toBeLessThan(40);
    const [r2, g2, b2] = channels(wavelengthColor(486.1));
    expect(b2).toBeGreaterThan(200);
    expect(g2).toBeGreaterThan(100);
    expect(r2).toBeLessThan(40);
    const [r3, g3, b3] = channels(wavelengthColor(410));
    expect(b3).toBeGreaterThan(100);
    expect(r3).toBeGreaterThan(40);
    expect(g3).toBeLessThan(10);
  });

  it('runs from violet through blue, green and yellow to red across 380 to 700 nm', () => {
    const stops = spectrumStops();
    expect(stops[0].at).toBe(0);
    expect(stops[stops.length - 1].at).toBe(1);
    const first = channels(stops[0].color);
    const last = channels(stops[stops.length - 1].color);
    expect(first[2]).toBeGreaterThan(first[1]); // violet end: blue beats green
    expect(last[0]).toBeGreaterThan(last[2]); // red end
    const green = channels(stops[Math.round(stops.length * 0.43)].color); // about 518 nm
    expect(green[1]).toBeGreaterThan(green[0]);
    expect(green[1]).toBeGreaterThan(green[2]);
  });

  it('colours the physics trace by wavelength and shows the spectrum strip', () => {
    const physics = SIGNALS.find((s) => s.id === 'physics')!;
    expect(physics.spectrumStrip).toBe(true);
    expect(physics.series[0].gradient!.length).toBeGreaterThan(10);
  });
});

describe('the maths figure', () => {
  const maths = SIGNALS.find((s) => s.id === 'mathematics')!;

  it('draws a dashed 1/|x| envelope that the curve never leaves, and that friction leaves alone', () => {
    const [curve, envelope] = maths.series;
    expect(envelope.dash).toBeTruthy();
    expect(envelope.noisy).toBe(false);
    expect(envelope.fill).toBe(false);
    for (const x of grid) expect(curve.at(x, 0)).toBeLessThanOrEqual(envelope.at(x, 0) + 1e-9);
  });
});
