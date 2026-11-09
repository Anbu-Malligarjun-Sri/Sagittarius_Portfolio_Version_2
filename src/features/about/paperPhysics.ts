/*
 * A sheet of paper as a grid of points joined by stiff links (position-based dynamics, "Verlet" integration).
 *
 * The links barely stretch, so when a hand squeezes the sheet together the extra length has nowhere to go but up:
 * it buckles into folds and wrinkles. Shear links stop the sheet skewing, and weaker "bend" links (every second
 * point) give it paper's stiffness rather than cloth's floppiness. The sheet lies on a desk (it cannot go below
 * z = 0) and a gentle pull toward its resting shape lets it relax flat again after it has been handled.
 *
 * Pure numbers, no DOM or 3D library, so it can be unit tested. Units: the sheet is `width` wide, `height` tall.
 */

export type Grab = { x: number; y: number; strength: number };
export type StepMetrics = {
  /** The furthest any point is from where it rests. */
  disp: number;
  /** The fastest any point moved this step. */
  speed: number;
};

const SUBSTEPS = 2;
const ITERATIONS = 8;
const DAMPING = 0.985;
const RESTORE_XY = 0.01;
const RESTORE_Z = 0.02;

export class PaperSim {
  readonly cols: number;
  readonly rows: number;
  readonly count: number;
  readonly width: number;
  readonly height: number;
  /** Where each point rests (x, y, z triples). */
  readonly rest: Float32Array;
  readonly pos: Float32Array;
  readonly prev: Float32Array;
  /** The hand: where it is on the sheet and how hard it is squeezing (0 to 1). Null when nothing is touching. */
  grab: Grab | null = null;
  /** How far across the sheet one hand reaches. */
  readonly radius: number;

  private readonly a: Uint32Array;
  private readonly b: Uint32Array;
  private readonly len: Float32Array;
  private readonly stiff: Float32Array;
  private readonly noise: Float32Array;

  constructor(cols: number, rows: number, width: number, height: number) {
    this.cols = cols;
    this.rows = rows;
    this.count = cols * rows;
    this.width = width;
    this.height = height;
    this.radius = width * 0.27;

    this.rest = new Float32Array(this.count * 3);
    this.noise = new Float32Array(this.count);
    for (let iy = 0; iy < rows; iy++) {
      for (let ix = 0; ix < cols; ix++) {
        const i = iy * cols + ix;
        const u = (ix / (cols - 1)) * 2 - 1;
        const v = (iy / (rows - 1)) * 2 - 1;
        this.rest[i * 3] = u * (width / 2);
        this.rest[i * 3 + 1] = -v * (height / 2);
        // A sheet lying on a desk is never perfectly flat: its corners lift a little and it has a slow ripple.
        this.rest[i * 3 + 2] = 0.01 + 0.014 * (u * u + v * v * (width / height)) + 0.004 * Math.sin(u * 3.1 + v * 2.3);
        // a fixed, repeatable scatter in -1..1, used to break the symmetry of a squeeze
        this.noise[i] = (((i * 2654435761) >>> 0) / 4294967296) * 2 - 1;
      }
    }
    this.pos = new Float32Array(this.rest);
    this.prev = new Float32Array(this.rest);

    const a: number[] = [];
    const b: number[] = [];
    const k: number[] = [];
    const link = (i: number, j: number, stiffness: number) => {
      a.push(i);
      b.push(j);
      k.push(stiffness);
    };
    const at = (ix: number, iy: number) => iy * cols + ix;
    for (let iy = 0; iy < rows; iy++) {
      for (let ix = 0; ix < cols; ix++) {
        const i = at(ix, iy);
        if (ix + 1 < cols) link(i, at(ix + 1, iy), 1);
        if (iy + 1 < rows) link(i, at(ix, iy + 1), 1);
        if (ix + 1 < cols && iy + 1 < rows) {
          link(i, at(ix + 1, iy + 1), 0.8);
          link(at(ix + 1, iy), at(ix, iy + 1), 0.8);
        }
        if (ix + 2 < cols) link(i, at(ix + 2, iy), 0.35);
        if (iy + 2 < rows) link(i, at(ix, iy + 2), 0.35);
      }
    }
    this.a = Uint32Array.from(a);
    this.b = Uint32Array.from(b);
    this.stiff = Float32Array.from(k);
    this.len = new Float32Array(a.length);
    for (let c = 0; c < a.length; c++) {
      const i = a[c] * 3;
      const j = b[c] * 3;
      this.len[c] = Math.hypot(this.rest[j] - this.rest[i], this.rest[j + 1] - this.rest[i + 1], this.rest[j + 2] - this.rest[i + 2]);
    }
  }

  /** A light touch that does not grip: lifts the sheet a little near (x, y), which then ripples out and settles. */
  poke(x: number, y: number, amount: number) {
    const reach = this.radius * 0.8;
    for (let i = 0; i < this.count; i++) {
      const dx = x - this.pos[i * 3];
      const dy = y - this.pos[i * 3 + 1];
      const r = Math.hypot(dx, dy);
      if (r >= reach) continue;
      const w = 1 - r / reach;
      this.pos[i * 3 + 2] += amount * w * w;
    }
  }

  /** Put every point back where it rests, with no motion. */
  reset() {
    this.pos.set(this.rest);
    this.prev.set(this.rest);
    this.grab = null;
  }

  /** Advance one frame (about 1/60 s). */
  step(): StepMetrics {
    const { pos, prev, rest, count } = this;
    for (let s = 0; s < SUBSTEPS; s++) {
      // move each point on with the velocity it already had
      for (let n = 0; n < count * 3; n++) {
        const here = pos[n];
        pos[n] = here + (here - prev[n]) * DAMPING;
        prev[n] = here;
      }
      // ease back toward the resting shape
      for (let i = 0; i < count; i++) {
        const n = i * 3;
        pos[n] += (rest[n] - pos[n]) * RESTORE_XY;
        pos[n + 1] += (rest[n + 1] - pos[n + 1]) * RESTORE_XY;
        pos[n + 2] += (rest[n + 2] - pos[n + 2]) * RESTORE_Z;
      }
      this.applyHand();
      this.solveLinks();
      for (let i = 0; i < count; i++) {
        const n = i * 3;
        if (!Number.isFinite(pos[n]) || !Number.isFinite(pos[n + 1]) || !Number.isFinite(pos[n + 2])) {
          // never let one bad number spread: put that point back at rest
          for (let d = 0; d < 3; d++) {
            pos[n + d] = rest[n + d];
            prev[n + d] = rest[n + d];
          }
        }
        if (pos[n + 2] < 0) {
          pos[n + 2] = 0; // the desk
          prev[n + 2] = 0;
        }
      }
    }

    let disp = 0;
    let speed = 0;
    for (let i = 0; i < count; i++) {
      const n = i * 3;
      disp = Math.max(disp, Math.hypot(pos[n] - rest[n], pos[n + 1] - rest[n + 1], pos[n + 2] - rest[n + 2]));
      speed = Math.max(speed, Math.hypot(pos[n] - prev[n], pos[n + 1] - prev[n + 1], pos[n + 2] - prev[n + 2]));
    }
    return { disp, speed };
  }

  /** The squeeze: points under the hand are drawn toward it and nudged up, so the sheet bunches and buckles. */
  private applyHand() {
    const hand = this.grab;
    if (!hand || hand.strength <= 0) return;
    const { pos, noise, count, radius } = this;
    for (let i = 0; i < count; i++) {
      const n = i * 3;
      const dx = hand.x - pos[n];
      const dy = hand.y - pos[n + 1];
      const r = Math.hypot(dx, dy);
      if (r >= radius) continue;
      const falloff = (1 - r / radius) ** 2;
      const pull = Math.min(0.17, 0.24 * falloff * hand.strength);
      pos[n] += dx * pull;
      pos[n + 1] += dy * pull;
      pos[n + 2] += falloff * hand.strength * (0.003 + 0.0055 * (noise[i] * 0.5 + 0.5));
    }
  }

  private solveLinks() {
    const { pos, a, b, len, stiff } = this;
    for (let it = 0; it < ITERATIONS; it++) {
      for (let c = 0; c < a.length; c++) {
        const i = a[c] * 3;
        const j = b[c] * 3;
        const dx = pos[j] - pos[i];
        const dy = pos[j + 1] - pos[i + 1];
        const dz = pos[j + 2] - pos[i + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 1e-9) continue;
        const move = ((d - len[c]) / d) * 0.5 * stiff[c];
        pos[i] += dx * move;
        pos[i + 1] += dy * move;
        pos[i + 2] += dz * move;
        pos[j] -= dx * move;
        pos[j + 1] -= dy * move;
        pos[j + 2] -= dz * move;
      }
    }
  }
}
