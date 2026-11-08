/**
 * Builds the per-hair data for a plush tile: where each strand is rooted, what colour it is dyed,
 * how long it grows, which way it is combed, and which tuft it belongs to.
 *
 * Tile space is x, y in [-1, 1]; the tile is a rounded square of corner radius RADIUS.
 */

export const RADIUS = 0.46;

export type HairBuffers = {
  count: number;
  roots: Float32Array; // vec2
  colors: Float32Array; // vec3 (sRGB 0..1)
  data: Float32Array; // vec4: length, comb angle, random A, random B
  clump: Float32Array; // vec2: vector from the root to its tuft centre
};

// R2 low-discrepancy sequence: every prefix of the sequence is evenly spread, so fewer hairs = a thinner but still even pile.
const R2_A = 0.7548776662466927;
const R2_B = 0.5698402909980532;
const frac = (v: number) => v - Math.floor(v);

/** Signed distance to the rounded-square tile edge (negative inside). */
export function tileSdf(x: number, y: number): number {
  const qx = Math.abs(x) - (1 - RADIUS);
  const qy = Math.abs(y) - (1 - RADIUS);
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - RADIUS;
}

function sdfGradient(x: number, y: number): [number, number] {
  const e = 0.004;
  const gx = tileSdf(x + e, y) - tileSdf(x - e, y);
  const gy = tileSdf(x, y + e) - tileSdf(x, y - e);
  const len = Math.hypot(gx, gy) || 1;
  return [gx / len, gy / len];
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace('#', '');
  return [parseInt(v.slice(0, 2), 16) / 255, parseInt(v.slice(2, 4), 16) / 255, parseInt(v.slice(4, 6), 16) / 255];
}

export function buildHair(opts: {
  count: number;
  art: ImageData; // the dyed artwork, square, transparent outside the logo
  furColor: string;
  seed: number;
}): HairBuffers {
  const { count, art, furColor, seed } = opts;
  const rand = mulberry32(seed);
  const fur = hexToRgb(furColor);
  const size = art.width;

  const roots = new Float32Array(count * 2);
  const colors = new Float32Array(count * 3);
  const data = new Float32Array(count * 4);
  const clump = new Float32Array(count * 2);

  // Tuft centres: one jittered point per grid cell. Each hair is pulled toward its nearest centre.
  const cell = 0.12;
  const cells = Math.ceil(2.4 / cell);
  const centres = new Float32Array(cells * cells * 2);
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) {
      const k = (j * cells + i) * 2;
      centres[k] = -1.2 + (i + 0.15 + rand() * 0.7) * cell;
      centres[k + 1] = -1.2 + (j + 0.15 + rand() * 0.7) * cell;
    }
  }
  const nearestCentre = (x: number, y: number): [number, number] => {
    const ci = Math.floor((x + 1.2) / cell);
    const cj = Math.floor((y + 1.2) / cell);
    let best = Infinity;
    let bx = x;
    let by = y;
    for (let dj = -1; dj <= 1; dj++) {
      for (let di = -1; di <= 1; di++) {
        const i = ci + di;
        const j = cj + dj;
        if (i < 0 || j < 0 || i >= cells || j >= cells) continue;
        const k = (j * cells + i) * 2;
        const d = (centres[k] - x) ** 2 + (centres[k + 1] - y) ** 2;
        if (d < best) {
          best = d;
          bx = centres[k];
          by = centres[k + 1];
        }
      }
    }
    return [bx - x, by - y];
  };

  const sampleArt = (x: number, y: number): [number, number, number, number] => {
    const u = Math.min(Math.max((x * 0.5 + 0.5) * size, 0), size - 1);
    const v = Math.min(Math.max((0.5 - y * 0.5) * size, 0), size - 1);
    const o = (Math.floor(v) * size + Math.floor(u)) * 4;
    const d = art.data;
    return [d[o] / 255, d[o + 1] / 255, d[o + 2] / 255, d[o + 3] / 255];
  };

  const rimCount = Math.floor(count * 0.08);
  const bodyCount = count - rimCount;
  let n = 1;

  for (let h = 0; h < count; h++) {
    let x: number;
    let y: number;
    let angle: number;
    let lengthScale = 1;

    if (h < bodyCount) {
      // Body hairs: R2 samples that land on the tile.
      do {
        x = (frac(0.5 + n * R2_A) * 2 - 1) * 1.04;
        y = (frac(0.5 + n * R2_B) * 2 - 1) * 1.04;
        n++;
      } while (tileSdf(x, y) > 0.02);
      const r = Math.hypot(x, y);
      // Combed out from the centre, with a gentle whorl that tightens toward the middle.
      angle = Math.atan2(y, x) + 0.42 * Math.max(0, 1 - r) + (rand() - 0.5) * 0.3;
    } else {
      // Rim hairs: rooted on the edge and combed outward, they fuzz the silhouette past the tile.
      x = (frac(0.5 + n * R2_A) * 2 - 1) * 1.1;
      y = (frac(0.5 + n * R2_B) * 2 - 1) * 1.1;
      n++;
      for (let k = 0; k < 3; k++) {
        const s = tileSdf(x, y);
        const [gx, gy] = sdfGradient(x, y);
        x -= gx * s;
        y -= gy * s;
      }
      const [gx, gy] = sdfGradient(x, y);
      const push = rand() * 0.045 - 0.012;
      x += gx * push;
      y += gy * push;
      angle = Math.atan2(gy, gx) + (rand() - 0.5) * 0.7;
      lengthScale = 1.15;
    }

    const [r, g, b, a] = sampleArt(x, y);
    const jitter = 0.9 + rand() * 0.2;
    colors[h * 3] = Math.min(1, (fur[0] + (r - fur[0]) * a) * jitter);
    colors[h * 3 + 1] = Math.min(1, (fur[1] + (g - fur[1]) * a) * jitter);
    colors[h * 3 + 2] = Math.min(1, (fur[2] + (b - fur[2]) * a) * jitter);

    roots[h * 2] = x;
    roots[h * 2 + 1] = y;

    // Hair inside the artwork grows a little longer, so the logo reads as raised appliqué.
    data[h * 4] = 0.15 * (0.7 + rand() * 0.6) * lengthScale * (1 + 0.22 * a);
    data[h * 4 + 1] = angle;
    data[h * 4 + 2] = rand();
    data[h * 4 + 3] = rand();

    const [cx, cy] = nearestCentre(x, y);
    clump[h * 2] = cx;
    clump[h * 2 + 1] = cy;
  }

  return { count, roots, colors, data, clump };
}
