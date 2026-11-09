import { describe, expect, it } from 'vitest';
import { FOR_WHOM, LETTER, LETTER_TEXT } from './copy';
import { PaperSim } from './paperPhysics';
import { CHART, CHART_EDGES, CHART_STARS, FIELDS } from './stars';

const run = (sim: PaperSim, frames: number) => {
  let last = { disp: 0, speed: 0 };
  for (let f = 0; f < frames; f++) {
    if (sim.grab) sim.grab.strength = Math.min(1, sim.grab.strength + 1 / 42);
    last = sim.step();
  }
  return last;
};

const stretch = (sim: PaperSim) => {
  // the longest any neighbouring pair has been pulled apart, relative to how far apart the two rest
  let worst = 0;
  for (let iy = 0; iy < sim.rows; iy++) {
    for (let ix = 0; ix + 1 < sim.cols; ix++) {
      const i = (iy * sim.cols + ix) * 3;
      const j = i + 3;
      const was = Math.hypot(sim.rest[j] - sim.rest[i], sim.rest[j + 1] - sim.rest[i + 1], sim.rest[j + 2] - sim.rest[i + 2]);
      const now = Math.hypot(sim.pos[j] - sim.pos[i], sim.pos[j + 1] - sim.pos[i + 1], sim.pos[j + 2] - sim.pos[i + 2]);
      worst = Math.max(worst, now / was);
    }
  }
  return worst;
};

describe('PaperSim', () => {
  it('stays at rest when nothing touches it', () => {
    const sim = new PaperSim(26, 38, 1, 1.5);
    const { disp } = run(sim, 120);
    expect(disp).toBeLessThan(1e-3);
  });

  it('buckles when squeezed, without blowing up', () => {
    const sim = new PaperSim(26, 38, 1, 1.5);
    sim.grab = { x: 0, y: 0, strength: 0 };
    const { disp } = run(sim, 150);
    expect(disp).toBeGreaterThan(0.03); // it really deforms
    expect(disp).toBeLessThan(1.2); // and stays on the desk, nowhere near flying off
    expect(Array.from(sim.pos).every(Number.isFinite)).toBe(true);
    expect(stretch(sim)).toBeLessThan(1.4); // paper does not stretch like rubber
  });

  it('never goes through the desk', () => {
    const sim = new PaperSim(26, 38, 1, 1.5);
    sim.grab = { x: 0.1, y: 0.2, strength: 0 };
    run(sim, 150);
    let lowest = Infinity;
    for (let i = 2; i < sim.pos.length; i += 3) lowest = Math.min(lowest, sim.pos[i]);
    expect(lowest).toBeGreaterThanOrEqual(0);
  });

  it('can be dragged and still relaxes flat once let go', () => {
    const sim = new PaperSim(26, 38, 1, 1.5);
    sim.grab = { x: -0.2, y: 0.3, strength: 0 };
    run(sim, 60);
    for (let f = 0; f < 60; f++) {
      sim.grab.x += 0.006; // dragged across the sheet
      run(sim, 1);
    }
    sim.grab = null;
    const { disp, speed } = run(sim, 700);
    expect(disp).toBeLessThan(0.02);
    expect(speed).toBeLessThan(1e-3);
  });

  it('ripples and settles after a light touch', () => {
    const sim = new PaperSim(26, 38, 1, 1.5);
    sim.poke(0, 0, 0.05);
    expect(run(sim, 1).disp).toBeGreaterThan(0);
    expect(run(sim, 400).disp).toBeLessThan(0.01);
  });

  it('survives a very tall sheet (a phone-sized letter)', () => {
    const sim = new PaperSim(30, 80, 1, 2.4);
    sim.grab = { x: 0, y: -0.5, strength: 0 };
    run(sim, 120);
    expect(Array.from(sim.pos).every(Number.isFinite)).toBe(true);
  });
});

describe('the letter', () => {
  it('says plainly that the company is new, and does not claim a track record it does not have', () => {
    expect(LETTER_TEXT).toMatch(/2026/);
    expect(LETTER_TEXT).toMatch(/new/i);
    // no invented history, customers or numbers
    expect(LETTER_TEXT).not.toMatch(/2012|2024|twelve|years of experience|decade|clients|customers|retention|\b\d{2,}\+|\b200\b|\b40 countries\b/i);
  });

  it('avoids announcing its own humility, which readers distrust', () => {
    expect(LETTER_TEXT).not.toMatch(/humbled|humble|passionate|world-class|best-in-class|cutting-edge|revolutionary|synergy|leverage/i);
  });

  it('is signed by the three founders and names the four sciences', () => {
    expect(LETTER.signature).toMatch(/Anbu/);
    expect(LETTER.signature).toMatch(/Brajin/);
    expect(LETTER.signature).toMatch(/Arun/);
    expect(FOR_WHOM).toEqual(expect.arrayContaining(['Biology', 'Physics', 'Chemistry', 'Mathematics']));
  });

  it('is short enough to read in a minute or two', () => {
    const words = LETTER_TEXT.split(/\s+/).length;
    expect(words).toBeGreaterThan(120);
    expect(words).toBeLessThan(260);
  });

  it('only lists work that is really ours to show: the two early projects, and not the symposium website', () => {
    expect(LETTER_TEXT).not.toMatch(/symposium|techazura/i);
    expect(LETTER_TEXT).toMatch(/two small things/i);
    expect(LETTER_TEXT).toMatch(/deep-sea DNA/i);
    expect(LETTER_TEXT).toMatch(/local AI assistant/i);
  });
});

describe('the star chart', () => {
  const ids = new Set(CHART_STARS.map((star) => star.id));

  it('names the four sciences and everyday places in the order the letter does, then adds the companion', () => {
    const labels = FIELDS.map((field) => field.label);
    expect(labels.filter((label) => label !== 'Companion')).toEqual([...FOR_WHOM]);
    expect(labels).toContain('Companion');
  });

  it('gives every field a different, real star and a small everyday example of friction', () => {
    expect(new Set(FIELDS.map((field) => field.starId)).size).toBe(FIELDS.length);
    expect(new Set(FIELDS.map((field) => field.numeral)).size).toBe(FIELDS.length);
    for (const field of FIELDS) {
      expect(ids.has(field.starId)).toBe(true);
      expect(field.starName.length).toBeGreaterThan(3);
      expect(field.friction.length).toBeGreaterThan(15);
      // an everyday frustration, not a claim: no percentages, no numbers, no "faster" or "better"
      expect(field.friction).not.toMatch(/\d+%|\d{2,}|faster|better|best/i);
    }
  });

  it('only shows a star as lit where there is real work, and that matches what the letter says we have built', () => {
    const started = FIELDS.filter((field) => field.status === 'started');
    // the letter says "two small things": an AI that reads deep-sea DNA, and a local AI assistant
    expect(started.map((field) => field.id).sort()).toEqual(['biology', 'companion']);
    expect(LETTER_TEXT).toMatch(/two small things/i);
    expect(started.find((field) => field.id === 'biology')!.work).toMatch(/deep-sea DNA/i);
    expect(started.find((field) => field.id === 'companion')!.work).toMatch(/local AI assistant/i);
    // and the dark ones say plainly that nothing is built there yet, rather than implying it
    for (const field of FIELDS.filter((f) => f.status === 'listening')) expect(field.work).toMatch(/nothing built here yet/i);
  });

  it('does not list the symposium website or any showcase site as work', () => {
    for (const field of FIELDS) expect(`${field.work} ${field.friction}`).not.toMatch(/symposium|techazura/i);
  });

  it('joins stars that exist, once each, into one connected pattern', () => {
    const seen = new Set<string>();
    for (const [a, b] of CHART_EDGES) {
      expect(ids.has(a) && ids.has(b)).toBe(true);
      expect(a).not.toBe(b);
      const key = [a, b].sort().join('|');
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
    const reach = new Set<string>([CHART_STARS[0].id]);
    for (let pass = 0; pass < CHART_STARS.length; pass++) {
      for (const [a, b] of CHART_EDGES) {
        if (reach.has(a)) reach.add(b);
        if (reach.has(b)) reach.add(a);
      }
    }
    expect(reach.size).toBe(CHART_STARS.length);
  });

  it('keeps every star and every name inside the frame', () => {
    for (const star of CHART_STARS) {
      expect(star.x).toBeGreaterThan(30);
      expect(star.x).toBeLessThan(CHART.w - 30);
      expect(star.y).toBeGreaterThan(40);
      expect(star.y).toBeLessThan(CHART.h - 40);
      expect(star.tint).toMatch(/^#[0-9a-f]{6}$/i);
    }
    for (const field of FIELDS) {
      const wide = field.label.length * 10.4 + 12; // a generous guess at the width of the name, in drawing units
      const { x, y, anchor = 'middle' } = field.labelAt;
      const left = anchor === 'start' ? x - 6 : anchor === 'end' ? x - wide : x - wide / 2;
      expect(left).toBeGreaterThan(22);
      expect(left + wide).toBeLessThan(CHART.w - 22);
      expect(y).toBeGreaterThan(30);
      expect(y).toBeLessThan(CHART.h - 24);
    }
  });
});
