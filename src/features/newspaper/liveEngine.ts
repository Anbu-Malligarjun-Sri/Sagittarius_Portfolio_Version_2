import { layoutBlocks, type Block, type Column, type PlacedWord, type Rect, type TextStyle } from './layoutEngine';
import type { Article } from './articles';

/**
 * One live page of the broadsheet. The story's text is drawn on a canvas by our own layout engine, so it can flow
 * around a photograph that is being moved, every frame: a wide headline across the top, then two columns.
 * Words glide to their new places, the letters shimmer, and glyphs near the cursor are pushed aside like wet ink.
 * The photograph can be brushed aside with the cursor or dragged, and it drifts back toward where it sits.
 */

const INK = '#1b130a';
const RED = '#7a1f12';
const GAP = 38; // gutter between the two body columns
const BOTTOM_PAD = 10;
const POINTER_RADIUS = 96;
const PHOTO_MARGIN = 13; // clear space kept between the photograph and the text
const NUDGE_LIMIT = 16; // furthest a hover alone can move the photograph from where it sits, in px
const MIN_SEGMENT = 112; // free gaps narrower than this are left empty

type Photo = {
  el: HTMLElement;
  w: number;
  h: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number; // where it drifts back to
  hy: number;
  tilt: number;
  dragging: boolean;
  dragMoved: number;
  grabX: number;
  grabY: number;
};

type Metrics = { W: number; H: number; columns: Column[]; colW: number; styles: Record<string, TextStyle>; photoW: number };

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

// Body text sizes to try, largest first: the page picks the largest one that fits, so the page is well filled.
const BODY_SIZES = [24, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12];

export function startLivePage(opts: { stage: HTMLElement; canvas: HTMLCanvasElement; photo: HTMLElement; article: Article }): () => void {
  const { stage, canvas, photo: photoEl, article } = opts;
  const ctx = canvas.getContext('2d');
  const measureCtx = document.createElement('canvas').getContext('2d');
  if (!ctx || !measureCtx) return () => {};

  let disposed = false;
  let raf = 0;
  let visible = true;
  let cleanup: () => void = () => {};

  const init = async () => {
    // --- Fonts: read the real family names that next/font generated, and make sure they are loaded before measuring. ---
    const family = (cssVar: string) => {
      const probe = document.createElement('span');
      probe.style.cssText = `position:absolute;visibility:hidden;font-family:var(${cssVar})`;
      probe.textContent = 'x';
      stage.appendChild(probe);
      const name = getComputedStyle(probe).fontFamily;
      probe.remove();
      return name;
    };
    const fell = family('--font-fell');
    const serif = family('--font-serif');
    const mono = family('--font-mono');
    await Promise.all([
      document.fonts.load(`400 15px ${fell}`),
      document.fonts.load(`italic 400 15px ${fell}`),
      document.fonts.load(`900 30px ${serif}`),
      document.fonts.load(`700 11px ${mono}`),
    ]).catch(() => undefined);
    if (disposed) return;

    // --- Measuring (cached) ---
    const widthCache = new Map<string, number>();
    const measure = (font: string, text: string) => {
      const key = `${font}|${text}`;
      let w = widthCache.get(key);
      if (w === undefined) {
        measureCtx.font = font;
        w = measureCtx.measureText(text).width;
        widthCache.set(key, w);
      }
      return w;
    };

    // --- Metrics (depend on the stage size and the chosen body size) ---
    const computeMetrics = (W: number, H: number, bodySize: number): Metrics => {
      const cols = W >= 640 ? 2 : 1;
      const colW = (W - GAP * (cols - 1)) / cols;
      const columns: Column[] = Array.from({ length: cols }, (_, i) => ({ x: i * (colW + GAP), w: colW }));
      const hs = Math.round(clamp(W * 0.05, 32, 56));
      const lh = Math.round(bodySize * 1.4);
      const pull = Math.round(bodySize * 1.45);
      const styles: Record<string, TextStyle> = {
        kicker: { font: `700 11px ${mono}`, size: 11, lineHeight: 17, align: 'left', spaceBefore: 0, spaceAfter: 6, baseline: 12 },
        headline: { font: `900 ${hs}px ${serif}`, size: hs, lineHeight: Math.round(hs * 1.08), align: 'left', spaceBefore: 0, spaceAfter: 8, baseline: Math.round(hs * 0.84) },
        byline: { font: `italic 400 13px ${fell}`, size: 13, lineHeight: 18, align: 'left', spaceBefore: 0, spaceAfter: 4, baseline: 13 },
        body: { font: `400 ${bodySize}px ${fell}`, size: bodySize, lineHeight: lh, align: 'justify', spaceBefore: 0, spaceAfter: Math.round(bodySize * 0.6), baseline: Math.round(bodySize * 0.98) },
        pull: { font: `italic 400 ${pull}px ${fell}`, size: pull, lineHeight: Math.round(pull * 1.25), align: 'left', spaceBefore: 4, spaceAfter: 10, baseline: Math.round(pull * 0.95) },
        dropcap: { font: `900 ${Math.round(lh * 3.7)}px ${serif}`, size: Math.round(lh * 3.7), lineHeight: lh, align: 'left', spaceBefore: 0, spaceAfter: 0, baseline: Math.round(bodySize * 0.98) },
      };
      return { W, H, columns, colW, styles, photoW: clamp(W * 0.34, 220, 360) };
    };

    // --- The words of the page, in reading order ---
    const split = (t: string) => t.split(/\s+/).filter(Boolean);
    const headBlocks: Block[] = [
      { style: 'kicker', words: split(article.kicker), article: 0 },
      { style: 'headline', words: split(article.headline), article: 0 },
      { style: 'byline', words: split(article.byline), article: 0 },
    ];
    const bodyBlocks: Block[] = [];
    article.paragraphs.forEach((p, k) => {
      bodyBlocks.push({ style: 'body', words: split(p), article: 0, ...(k === 0 ? { dropCap: { style: 'dropcap', lines: 3 } } : {}) });
      if (k === 0 && article.quote) bodyBlocks.push({ style: 'pull', words: split(`“${article.quote}”`), article: 0 });
    });

    let m = computeMetrics(stage.clientWidth, stage.clientHeight, 15);
    let words: PlacedWord[] = [];
    let keys: string[] = [];
    let cx = new Float32Array(0);
    let cy = new Float32Array(0);
    let alpha = new Float32Array(0);
    let born = new Float32Array(0);
    let bodyTop = 0;
    let bodyBottom = 0;
    let entered = false;
    let reflows = 0;

    // --- The photograph ---
    const photo: Photo = { el: photoEl, w: 0, h: 0, x: 0, y: 0, vx: 0, vy: 0, hx: 0, hy: 0, tilt: -1.8, dragging: false, dragMoved: 0, grabX: 0, grabY: 0 };

    const sizePhoto = () => {
      photo.el.style.width = `${m.photoW}px`;
      photo.w = photo.el.offsetWidth;
      photo.h = photo.el.offsetHeight;
    };
    const exclusions = (): Rect[] => [{ x: photo.x - PHOTO_MARGIN, y: photo.y - PHOTO_MARGIN, w: photo.w + PHOTO_MARGIN * 2, h: photo.h + PHOTO_MARGIN * 2 }];

    const headLayout = () =>
      layoutBlocks({ blocks: headBlocks, styles: m.styles, columns: [{ x: 2, w: m.W - 4 }], top: 4, columnHeight: 1e6, exclusions: [], measure, minSegment: MIN_SEGMENT });

    /** Lays the whole page out around the given exclusions: a wide head, then the body in its columns. */
    const layoutAll = (ex: Rect[]) => {
      const head = layoutBlocks({ blocks: headBlocks, styles: m.styles, columns: [{ x: 2, w: m.W - 4 }], top: 4, columnHeight: 1e6, exclusions: ex, measure, minSegment: MIN_SEGMENT });
      const top = head.bottom + 16;
      const body = layoutBlocks({ blocks: bodyBlocks, styles: m.styles, columns: m.columns, top, columnHeight: m.H - top - BOTTOM_PAD, exclusions: ex, measure, minSegment: MIN_SEGMENT });
      return { words: [...head.words, ...body.words], top, bottom: body.bottom };
    };

    /**
     * Home for the photograph: in the second column, tucked just beneath the end of that column's text (so the page
     * reads as one composition), and never higher than the opening lines of the story.
     */
    const placeHome = (top: number, snap: boolean) => {
      const col = m.columns[m.columns.length - 1];
      photo.hx = clamp(col.x + (col.w - photo.w) / 2, 0, m.W - photo.w);
      // Where does the text end, if the photograph were not there?
      const bare = layoutBlocks({ blocks: bodyBlocks, styles: m.styles, columns: m.columns, top, columnHeight: m.H - top - BOTTOM_PAD, exclusions: [], measure, minSegment: MIN_SEGMENT });
      const last = bare.words[bare.words.length - 1];
      const inLastColumn = !!last && m.columns.length > 1 && last.x >= col.x - 1;
      const textEnd = inLastColumn ? last.y + m.styles[last.style].lineHeight : top;
      const lowest = Math.max(m.H - photo.h - 12, top + 50);
      photo.hy = clamp(textEnd + 30, top + 50, lowest);
      if (snap) {
        photo.x = photo.hx;
        photo.y = photo.hy;
        photo.vx = photo.vy = 0;
      }
    };

    // The canvas is sized exactly to the stage.
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(m.W * dpr);
      canvas.height = Math.round(m.H * dpr);
      canvas.style.width = `${m.W}px`;
      canvas.style.height = `${m.H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Words are tracked by identity (style, text, occurrence), so they glide to their new place when the layout changes. */
    const sync = (first: boolean) => {
      const oldIndex = new Map<string, number>();
      keys.forEach((k, i) => oldIndex.set(k, i));
      const seen = new Map<string, number>();
      const nk: string[] = [];
      const ncx = new Float32Array(words.length);
      const ncy = new Float32Array(words.length);
      const nalpha = new Float32Array(words.length);
      const nborn = new Float32Array(words.length);
      words.forEach((w, i) => {
        const base = `${w.style}|${w.text}`;
        const n = seen.get(base) ?? 0;
        seen.set(base, n + 1);
        const key = `${base}|${n}`;
        nk.push(key);
        const oi = oldIndex.get(key);
        if (!first && oi !== undefined) {
          ncx[i] = cx[oi];
          ncy[i] = cy[oi];
          nalpha[i] = alpha[oi];
          nborn[i] = born[oi];
        } else if (first) {
          // Arriving: the words fly in from scattered places, headline first.
          ncx[i] = w.x + (Math.random() - 0.5) * 240;
          ncy[i] = w.baseline + 30 + Math.random() * 90;
          nalpha[i] = 0;
          nborn[i] = i * 0.0035;
        } else {
          ncx[i] = w.x;
          ncy[i] = w.baseline;
          nalpha[i] = 1;
        }
      });
      keys = nk;
      cx = ncx;
      cy = ncy;
      alpha = nalpha;
      born = nborn;
    };

    const relayout = (first = false) => {
      const r = layoutAll(exclusions());
      words = r.words;
      bodyTop = r.top;
      bodyBottom = r.bottom;
      sync(first);
      reflows += 1;
      stage.dataset.reflows = String(reflows);
    };

    // --- Pointer ---
    const pointer = { x: -999, y: -999, vx: 0, vy: 0, inside: false, lastT: 0 };
    const stagePoint = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = stagePoint(e);
      const dt = Math.max((e.timeStamp - pointer.lastT) / 1000, 0.004);
      // While the photograph is being dragged, the cursor's speed must not also "brush" it.
      if (photo.dragging) {
        pointer.vx = pointer.vy = 0;
      } else if (pointer.inside && dt < 0.2) {
        pointer.vx += ((p.x - pointer.x) / dt - pointer.vx) * 0.4;
        pointer.vy += ((p.y - pointer.y) / dt - pointer.vy) * 0.4;
      }
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.lastT = e.timeStamp;
      pointer.inside = true;
      kick();
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.x = pointer.y = -999;
    };

    // Dragging the photograph: it stays where it is dropped (that becomes its new home).
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const pt = stagePoint(e);
      photo.dragging = true;
      photo.dragMoved = 0;
      photo.grabX = pt.x - photo.x;
      photo.grabY = pt.y - photo.y;
      photo.vx = photo.vy = 0;
      photo.el.setPointerCapture(e.pointerId);
      photo.el.dataset.drag = '1';
      kick();
    };
    const move = (e: PointerEvent) => {
      if (!photo.dragging) return;
      const pt = stagePoint(e);
      const nx = clamp(pt.x - photo.grabX, 0, m.W - photo.w);
      const ny = clamp(pt.y - photo.grabY, 0, Math.max(m.H - photo.h, 0));
      photo.dragMoved += Math.hypot(nx - photo.x, ny - photo.y);
      photo.vx = (nx - photo.x) * 40;
      photo.vy = (ny - photo.y) * 40;
      photo.x = nx;
      photo.y = ny;
    };
    const up = () => {
      if (!photo.dragging) return;
      photo.dragging = false;
      delete photo.el.dataset.drag;
      if (photo.dragMoved > 6) {
        photo.hx = photo.x;
        photo.hy = photo.y;
      }
      // A drop is a drop, not a throw: it stays exactly where it was put.
      photo.vx = 0;
      photo.vy = 0;
      pointer.vx = 0;
      pointer.vy = 0;
    };
    const clickPhoto = (e: MouseEvent) => {
      if (photo.dragMoved > 6) {
        e.preventDefault();
        photo.dragMoved = 0;
      }
    };
    photo.el.addEventListener('pointerdown', down);
    photo.el.addEventListener('pointermove', move);
    photo.el.addEventListener('pointerup', up);
    photo.el.addEventListener('pointercancel', up);
    photo.el.addEventListener('click', clickPhoto, true);

    // Clicking the headline opens the project.
    let hoverHeadline = false;
    const onClick = () => {
      const href = article.links[0]?.href;
      if (hoverHeadline && !photo.dragging && href) window.open(href, '_blank', 'noopener,noreferrer');
    };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('click', onClick);

    // --- Physics for the photograph ---
    const stepPhoto = (dt: number) => {
      const p = photo;
      if (p.dragging) return true;
      // Hovering only nudges the photograph a little (it never wanders off): moving it for real takes a click and drag.
      if (pointer.inside && Math.hypot(pointer.vx, pointer.vy) > 120) {
        const near = pointer.x > p.x - 10 && pointer.x < p.x + p.w + 10 && pointer.y > p.y - 10 && pointer.y < p.y + p.h + 10;
        if (near) {
          const k = Math.min(1, 6 * dt);
          p.vx += (pointer.vx * 0.06 - p.vx) * k;
          p.vy += (pointer.vy * 0.06 - p.vy) * k;
        }
      }
      // Drifts back toward its home, without bouncing.
      p.vx += (p.hx - p.x) * 6 * dt;
      p.vy += (p.hy - p.y) * 6 * dt;
      const damp = Math.exp(-4.6 * dt);
      p.vx *= damp;
      p.vy *= damp;
      p.x = clamp(p.x + p.vx * dt, 0, m.W - p.w);
      p.y = clamp(p.y + p.vy * dt, 0, Math.max(m.H - p.h, 0));
      // However hard the cursor sweeps, a hover can only take it a few pixels from where it sits.
      p.x = clamp(p.x, p.hx - NUDGE_LIMIT, p.hx + NUDGE_LIMIT);
      p.y = clamp(p.y, p.hy - NUDGE_LIMIT, p.hy + NUDGE_LIMIT);
      return Math.abs(p.vx) + Math.abs(p.vy) > 1.5 || Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y) > 0.5;
    };

    // Per-glyph offsets within a word, for the wet-ink effect.
    const glyphCache = new Map<string, number[]>();
    const glyphOffsets = (font: string, text: string) => {
      const key = `${font}|${text}`;
      let g = glyphCache.get(key);
      if (!g) {
        g = [];
        for (let i = 0; i <= text.length; i++) g.push(measure(font, text.slice(0, i)));
        glyphCache.set(key, g);
      }
      return g;
    };

    // --- Drawing ---
    let lastDraw = 0;
    let clock = 0;

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, m.W, m.H);

      // Rules: a double line under the head, and a rule between the two body columns.
      ctx.strokeStyle = 'rgba(27,19,10,0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, bodyTop - 9.5);
      ctx.lineTo(m.W, bodyTop - 9.5);
      ctx.moveTo(0, bodyTop - 6.5);
      ctx.lineTo(m.W, bodyTop - 6.5);
      if (m.columns.length > 1) {
        const x = Math.round(m.columns[0].x + m.colW + GAP / 2) + 0.5;
        const bottom = Math.min(m.H - 4, Math.max(bodyBottom, bodyTop + 80) + 8);
        ctx.moveTo(x - 2, bodyTop - 2);
        ctx.lineTo(x - 2, bottom);
        ctx.moveTo(x + 2, bodyTop - 2);
        ctx.lineTo(x + 2, bottom);
      }
      ctx.stroke();

      ctx.textBaseline = 'alphabetic';
      let font = '';
      hoverHeadline = false;
      const k = 1 - Math.exp(-dt * 13);
      const px = pointer.x;
      const py = pointer.y;
      const near = pointer.inside;

      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const style = m.styles[w.style];
        // Each word glides to its place, and fades in when the page first appears.
        cx[i] += (w.x - cx[i]) * k;
        cy[i] += (w.baseline - cy[i]) * k;
        if (born[i] > 0) born[i] -= dt;
        else alpha[i] = Math.min(1, alpha[i] + dt * 1.8);
        if (alpha[i] <= 0.01) continue;

        const x = cx[i] + Math.cos(clock * 0.6 + i * 0.21) * 0.28;
        const y = cy[i] + Math.sin(clock * 0.85 + i * 0.37) * 0.4;
        const isHead = w.style === 'headline';
        const isCap = w.isDropCap;

        if (style.font !== font) {
          ctx.font = style.font;
          font = style.font;
        }
        ctx.globalAlpha = alpha[i];
        ctx.fillStyle = w.style === 'kicker' || w.style === 'pull' ? RED : w.style === 'byline' ? 'rgba(27,19,10,0.68)' : INK;

        // Is the pointer on the headline?
        if (isHead && near && px > x - 3 && px < x + w.w + 3 && py > y - style.size && py < y + 6) hoverHeadline = true;

        // Is the pointer close enough to disturb the letters?
        let disturbed = false;
        if (near) {
          const dx = px < x ? x - px : px > x + w.w ? px - (x + w.w) : 0;
          const dy = Math.max(0, Math.abs(py - (y - style.size * 0.3)) - style.size * 0.5);
          disturbed = Math.hypot(dx, dy) < POINTER_RADIUS;
        }

        if (disturbed || isHead || isCap) {
          const offs = glyphOffsets(style.font, w.text);
          for (let g = 0; g < w.text.length; g++) {
            const gw = offs[g + 1] - offs[g];
            const gcx = x + offs[g] + gw / 2;
            let gy = y;
            if (isHead) gy += Math.sin(clock * 1.7 + g * 0.55 + i * 0.4) * 1.1; // living headline
            let ox = 0;
            let oy = 0;
            let rot = 0;
            let sc = 1;
            if (near) {
              const ddx = gcx - px;
              const ddy = gy - style.size * 0.32 - py;
              const d = Math.hypot(ddx, ddy) || 1;
              if (d < POINTER_RADIUS) {
                const f = (1 - d / POINTER_RADIUS) ** 2;
                ox = (ddx / d) * f * 30;
                oy = (ddy / d) * f * 30;
                rot = (ddx >= 0 ? 1 : -1) * f * 0.55;
                sc = 1 + f * 0.45;
              }
            }
            if (ox === 0 && oy === 0 && rot === 0) {
              ctx.fillText(w.text[g], x + offs[g], gy);
            } else {
              ctx.save();
              ctx.translate(gcx + ox, gy + oy);
              ctx.rotate(rot);
              ctx.scale(sc, sc);
              ctx.fillText(w.text[g], -gw / 2, 0);
              ctx.restore();
            }
          }
        } else {
          ctx.fillText(w.text, x, y);
        }
      }
      ctx.globalAlpha = 1;

      // A hovered headline is underlined, and an arrow shows that it leads somewhere.
      if (hoverHeadline && article.links[0]) {
        ctx.strokeStyle = RED;
        ctx.fillStyle = RED;
        ctx.lineWidth = 1.5;
        let lastIdx = -1;
        words.forEach((w, i) => {
          if (w.style === 'headline') {
            ctx.beginPath();
            ctx.moveTo(cx[i], cy[i] + 4);
            ctx.lineTo(cx[i] + w.w, cy[i] + 4);
            ctx.stroke();
            lastIdx = i;
          }
        });
        if (lastIdx >= 0) {
          ctx.font = `700 ${m.styles.headline.size * 0.7}px ${mono}`;
          ctx.fillText('↗', cx[lastIdx] + words[lastIdx].w + 6, cy[lastIdx] - 4);
        }
      }
    };

    // --- The frame loop ---
    const frame = (now: number) => {
      raf = 0;
      if (disposed || !visible) return;
      const dt = Math.min((now - lastDraw) / 1000 || 0.016, 0.05);
      const idle = !pointer.inside && !photo.dragging && entered;
      if (idle && now - lastDraw < 33) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastDraw = now;
      clock += dt;

      pointer.vx *= Math.exp(-7 * dt);
      pointer.vy *= Math.exp(-7 * dt);

      const bx = photo.x;
      const by = photo.y;
      const moving = stepPhoto(dt);
      if (moving || Math.abs(photo.x - bx) + Math.abs(photo.y - by) > 0.2) relayout();

      const rot = photo.tilt + clamp(photo.vx * 0.01, -5, 5);
      photo.el.style.transform = `translate3d(${photo.x.toFixed(1)}px, ${photo.y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;

      draw(dt);
      if (!entered && words.length && alpha[words.length - 1] >= 1) entered = true;
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(frame);
    };

    // --- Set up (and set up again if the stage changes size) ---
    const setup = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (W < 50 || H < 50) return;
      // Choose the largest body size whose text fits the page, with a little room to spare.
      let chosen = BODY_SIZES[BODY_SIZES.length - 1];
      for (const size of BODY_SIZES) {
        m = computeMetrics(W, H, size);
        sizePhoto();
        placeHome(headLayout().bottom + 16, true);
        const r = layoutAll(exclusions());
        // It fits when the very last word lands inside the page (the first column is always full when text flows on,
        // so the overall bottom says nothing). One line of room is kept for when the photograph is moved around.
        const last = r.words[r.words.length - 1];
        if (last && last.y + m.styles[last.style].lineHeight <= H - BOTTOM_PAD - m.styles.body.lineHeight) {
          chosen = size;
          break;
        }
      }
      m = computeMetrics(W, H, chosen);
      sizePhoto();
      placeHome(headLayout().bottom + 16, true);
      resizeCanvas();
      keys = [];
      relayout(true);
      stage.dataset.ready = '1';
      stage.dataset.bodySize = String(chosen);
    };
    setup();

    let lastW = stage.clientWidth;
    let lastH = stage.clientHeight;
    const ro = new ResizeObserver(() => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 2) return;
      lastW = w;
      lastH = h;
      setup();
      kick();
    });
    ro.observe(stage);

    // Only run while on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
      },
      { rootMargin: '60px' },
    );
    io.observe(stage);

    kick();

    cleanup = () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('click', onClick);
      photo.el.removeEventListener('pointerdown', down);
      photo.el.removeEventListener('pointermove', move);
      photo.el.removeEventListener('pointerup', up);
      photo.el.removeEventListener('pointercancel', up);
      photo.el.removeEventListener('click', clickPhoto, true);
      photo.el.style.transform = '';
      photo.el.style.width = '';
      delete stage.dataset.ready;
      delete stage.dataset.reflows;
      delete stage.dataset.bodySize;
    };
  };

  void init();

  return () => {
    disposed = true;
    cleanup();
  };
}
