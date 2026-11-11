import { LETTER } from './copy';

/*
 * Draws the letter onto a canvas, to be wrapped around the 3D sheet as its texture: paper fibre, two faint fold
 * creases, and the text in real type. The texture is always 1024 px wide; its height follows the length of the text, so
 * the sheet gets longer on a narrow screen instead of the type getting smaller.
 */

export const TEX_W = 1024;

export type PaperFonts = { title: string; body: string; hand: string; mono: string };

type Run = { text: string; x: number; y: number; font: string; fill: string; spacing?: number; align?: CanvasTextAlign };
type Tick = { x: number; y: number; size: number };
type Rule = { x1: number; x2: number; y: number };
export type Layout = { runs: Run[]; ticks: Tick[]; rules: Rule[]; height: number };

const INK = '#000000';
const RULE_INK = 'rgba(28, 36, 52, 0.62)';
const EMBER = '#b8431f';

/** The letter's families, as the browser actually knows them, with each face loaded so the canvas can use it. */
export async function resolveFonts(host: HTMLElement): Promise<PaperFonts> {
  const read = (cssVar: string, fallback: string) => {
    const probe = document.createElement('span');
    probe.style.cssText = `position:absolute;visibility:hidden;font-family:var(${cssVar}), ${fallback}`;
    host.appendChild(probe);
    const family = getComputedStyle(probe).fontFamily;
    probe.remove();
    return family || fallback;
  };
  const fonts: PaperFonts = {
    title: read('--font-paper-title', 'Georgia, serif'),
    body: read('--font-paper-body', 'Georgia, serif'),
    hand: read('--font-handwriting', 'cursive'),
    mono: read('--font-mono', 'monospace'),
  };
  const faces = [`italic 600 40px ${fonts.title}`, `400 30px ${fonts.body}`, `italic 400 30px ${fonts.body}`, `500 40px ${fonts.hand}`, `500 18px ${fonts.mono}`];
  const loading = Promise.all(faces.map((face) => document.fonts.load(face).catch(() => [])));
  // never wait forever for a slow font: the fallback face is perfectly readable
  await Promise.race([loading, new Promise((resolve) => setTimeout(resolve, 3000))]);
  return fonts;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const attempt = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(attempt).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = attempt;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Work out where every line of the letter goes, for a given body text size. Needs a 2D context only to measure text. */
export function layoutLetter(ctx: CanvasRenderingContext2D, fonts: PaperFonts, bodyPx: number): Layout {
  const runs: Run[] = [];
  const ticks: Tick[] = [];
  const rules: Rule[] = [];
  const margin = Math.round(TEX_W * 0.1);
  const textWidth = TEX_W - margin * 2;
  let y = Math.round(TEX_W * 0.075);

  // letterhead
  const headSize = Math.round(TEX_W * 0.0166);
  runs.push({ text: LETTER.letterhead[0].toUpperCase(), x: margin, y: y + headSize, font: `500 ${headSize}px ${fonts.mono}`, fill: INK, spacing: 5 });
  runs.push({ text: LETTER.letterhead[1].toUpperCase(), x: TEX_W - margin, y: y + headSize, font: `500 ${headSize}px ${fonts.mono}`, fill: INK, spacing: 5, align: 'right' });
  y += headSize + 18;
  rules.push({ x1: margin, x2: TEX_W - margin, y });
  y += Math.round(TEX_W * 0.055);

  const lines = (text: string, size: number, lineHeight: number, x: number, font: string, fill: string, width: number) => {
    ctx.font = font;
    for (const line of wrap(ctx, text, width)) {
      runs.push({ text: line, x, y: y + size * 0.8, font, fill });
      y += lineHeight;
    }
  };

  // headline
  const headline = Math.round(TEX_W * 0.062);
  lines(LETTER.headline, headline, headline * 1.1, margin, `italic 600 ${headline}px ${fonts.title}`, INK, textWidth);
  y += Math.round(TEX_W * 0.034);

  // the letter itself
  const bodyFont = `400 ${bodyPx}px ${fonts.body}`;
  for (const paragraph of LETTER.paragraphs) {
    lines(paragraph, bodyPx, bodyPx * 1.42, margin, bodyFont, INK, textWidth);
    y += bodyPx * 0.62;
  }

  // the promises, in handwriting, each with a tick
  y += bodyPx * 0.15;
  lines(LETTER.promisesLead, bodyPx, bodyPx * 1.35, margin, `italic 400 ${bodyPx}px ${fonts.body}`, INK, textWidth);
  const handSize = Math.round(bodyPx * 1.4);
  for (const promise of LETTER.promises) {
    ticks.push({ x: margin + 4, y: y + handSize * 0.62, size: handSize * 0.62 });
    lines(promise, handSize, handSize * 1.12, margin + handSize * 1.1, `500 ${handSize}px ${fonts.hand}`, INK, textWidth - handSize * 1.1);
  }
  y += bodyPx * 0.55;

  // the close, and the signature
  const closing = Math.round(bodyPx * 1.58);
  lines(LETTER.closing, closing, closing * 1.14, margin, `italic 600 ${closing}px ${fonts.title}`, INK, textWidth);
  y += bodyPx * 0.7;
  const sign = Math.round(bodyPx * 2.15);
  lines(LETTER.signature, sign, sign * 1.0, margin, `500 ${sign}px ${fonts.hand}`, INK, textWidth);
  y += Math.round(sign * 0.34); // room for the tails of the letters in the signature before the small line
  const small = Math.round(bodyPx * 0.6);
  runs.push({ text: LETTER.signoff.toUpperCase(), x: margin, y: y + small * 0.6, font: `500 ${small}px ${fonts.mono}`, fill: INK, spacing: 4 });
  y += small + Math.round(TEX_W * 0.085);

  return { runs, ticks, rules, height: Math.ceil(y) };
}

/** A repeatable stream of random numbers, so the paper looks the same every time it is drawn. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Paint at a higher resolution without changing the letter's layout coordinates. */
export function paintLetter(canvas: HTMLCanvasElement, layout: Layout, height: number, scale: number) {
  canvas.width = Math.floor(TEX_W * scale);
  canvas.height = Math.floor(height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(canvas.width / TEX_W, canvas.height / height);
  const rand = seeded(2026);

  const base = ctx.createLinearGradient(0, 0, 0, height);
  base.addColorStop(0, '#f7f0df');
  base.addColorStop(1, '#efe5cd');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, TEX_W, height);

  // paper fibre: short, faint strokes in every direction
  ctx.lineCap = 'round';
  const fibres = Math.round((TEX_W * height) / 520);
  for (let i = 0; i < fibres; i++) {
    const x = rand() * TEX_W;
    const y = rand() * height;
    const angle = rand() * Math.PI;
    const length = 5 + rand() * 18;
    ctx.strokeStyle = rand() > 0.45 ? `rgba(120, 98, 66, ${0.025 + rand() * 0.05})` : `rgba(255, 255, 255, ${0.07 + rand() * 0.1})`;
    ctx.lineWidth = 0.5 + rand() * 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  // the edges of an old sheet are a little darker
  const edge = ctx.createRadialGradient(TEX_W / 2, height / 2, Math.min(TEX_W, height) * 0.35, TEX_W / 2, height / 2, Math.max(TEX_W, height) * 0.72);
  edge.addColorStop(0, 'rgba(120, 90, 40, 0)');
  edge.addColorStop(1, 'rgba(120, 90, 40, 0.16)');
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, TEX_W, height);

  // two faint creases, where a letter has been folded in three
  for (const at of [height / 3, (height * 2) / 3]) {
    ctx.fillStyle = 'rgba(70, 52, 24, 0.07)';
    ctx.fillRect(0, at - 1.4, TEX_W, 2.8);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(0, at + 1.4, TEX_W, 2.2);
  }

  // rules
  ctx.strokeStyle = RULE_INK;
  ctx.lineWidth = 1.4;
  for (const rule of layout.rules) {
    ctx.beginPath();
    ctx.moveTo(rule.x1, rule.y);
    ctx.lineTo(rule.x2, rule.y);
    ctx.stroke();
  }

  // Reinforce fine letter strokes so they hold up when the texture is scaled down.
  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.lineWidth = 1.2;
  ctx.lineJoin = 'round';
  for (const run of layout.runs) {
    ctx.font = run.font;
    ctx.fillStyle = run.fill;
    ctx.textAlign = run.align ?? 'left';
    ctx.letterSpacing = `${run.spacing ?? 0}px`;
    ctx.strokeStyle = run.fill;
    ctx.strokeText(run.text, run.x, run.y);
    ctx.fillText(run.text, run.x, run.y);
  }
  ctx.restore();
  ctx.letterSpacing = '0px';

  // hand-drawn ticks beside the promises
  ctx.strokeStyle = EMBER;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const tick of layout.ticks) {
    ctx.lineWidth = Math.max(3, tick.size * 0.12);
    ctx.beginPath();
    ctx.moveTo(tick.x, tick.y);
    ctx.lineTo(tick.x + tick.size * 0.34, tick.y + tick.size * 0.46);
    ctx.lineTo(tick.x + tick.size * 1.0, tick.y - tick.size * 0.58);
    ctx.stroke();
  }
}

/** A small tiling noise used as the sheet's bump map, so light catches the grain of the paper. */
export function makeGrain(size = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const rand = seeded(7);
  const image = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 128 + (rand() - 0.5) * 60;
    image.data[i * 4] = v;
    image.data[i * 4 + 1] = v;
    image.data[i * 4 + 2] = v;
    image.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  ctx.lineCap = 'round';
  for (let i = 0; i < size * 5; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const angle = rand() * Math.PI;
    const length = 4 + rand() * 16;
    ctx.strokeStyle = rand() > 0.5 ? 'rgba(60,60,60,0.16)' : 'rgba(220,220,220,0.18)';
    ctx.lineWidth = 0.6 + rand();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }
  return canvas;
}
