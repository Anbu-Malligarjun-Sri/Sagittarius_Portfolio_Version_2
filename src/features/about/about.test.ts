import { describe, expect, it } from 'vitest';
import { FOR_WHOM, LETTER, LETTER_TEXT } from './copy';
import { PaperSim } from './paperPhysics';

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
});
