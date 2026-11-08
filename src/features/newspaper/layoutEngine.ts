/**
 * Newspaper text layout: flows words through columns, line by line, around rectangles ("exclusions")
 * such as photographs. Pure functions: no DOM, so it can be tested and re-run every frame.
 */

export type Rect = { x: number; y: number; w: number; h: number };
export type Column = { x: number; w: number };

export type TextStyle = {
  font: string;
  size: number;
  lineHeight: number;
  align: 'left' | 'justify';
  spaceBefore: number;
  spaceAfter: number;
  /** Distance from the top of a line to its baseline. */
  baseline: number;
  /** Lines of room that must be left in a column before this block may start there. */
  minLines?: number;
};

export type Block = {
  style: string;
  words: string[];
  article: number;
  /** Lines of room required before this block may start in a column (overrides the style's). */
  minLines?: number;
  /** Replace the first letter with a large initial that spans `lines` lines. */
  dropCap?: { style: string; lines: number };
};

export type PlacedWord = {
  /** Stable across layouts of the same blocks, so words can be animated from place to place. */
  id: number;
  text: string;
  /** Left edge. */
  x: number;
  /** Top of the line. */
  y: number;
  /** Absolute baseline. */
  baseline: number;
  w: number;
  style: string;
  article: number;
  isDropCap: boolean;
};

export type LayoutInput = {
  blocks: Block[];
  styles: Record<string, TextStyle>;
  columns: Column[];
  top: number;
  columnHeight: number;
  exclusions: Rect[];
  measure: (font: string, text: string) => number;
  /** Free gaps narrower than this are left empty rather than filled with a few cramped letters. */
  minSegment?: number;
};

export type LayoutResult = { words: PlacedWord[]; bottom: number };

/** The free horizontal stretches of a column for the band [y, y + height), after removing the exclusions. */
export function freeIntervals(column: Column, y: number, height: number, exclusions: Rect[], minSegment = 0): [number, number][] {
  let segments: [number, number][] = [[column.x, column.x + column.w]];
  for (const ex of exclusions) {
    if (ex.y >= y + height || ex.y + ex.h <= y) continue;
    const left = ex.x;
    const right = ex.x + ex.w;
    const next: [number, number][] = [];
    for (const [a, b] of segments) {
      if (right <= a || left >= b) {
        next.push([a, b]);
        continue;
      }
      if (left > a) next.push([a, left]);
      if (right < b) next.push([right, b]);
    }
    segments = next;
  }
  return segments.filter(([a, b]) => b - a >= minSegment).sort((p, q) => p[0] - q[0]);
}

export function layoutBlocks(input: LayoutInput): LayoutResult {
  const { blocks, styles, columns, top, columnHeight, measure, minSegment = 60 } = input;
  const bottomLimit = top + columnHeight;
  const out: PlacedWord[] = [];
  let col = 0;
  let y = top;
  let nextId = 0;
  let maxBottom = top;
  let guard = 0;

  /** Moves to the next column if there is one. */
  const nextColumn = () => {
    if (col >= columns.length - 1) return false;
    col += 1;
    y = top;
    return true;
  };

  for (const block of blocks) {
    const style = styles[block.style];
    const lh = style.lineHeight;
    const spaceW = measure(style.font, ' ');

    // Blocks that need some room (headlines, drop caps) start in the next column if the current one is nearly full.
    const needLines = block.minLines ?? style.minLines ?? 1;
    if (y + needLines * lh > bottomLimit) nextColumn();
    if (y > top) y += style.spaceBefore;
    if (y + lh > bottomLimit) nextColumn();

    let words = block.words.slice();
    const local: Rect[] = [];
    let dropCapBottom = 0;

    // The large initial sits on the first line, and the text wraps around it. It needs a free strip at the column's
    // left edge for its whole height. If a photograph is in the way, the paragraph simply starts without the initial
    // (a printer would do the same) instead of leaving a gap or printing the letter underneath the picture.
    if (block.dropCap && words.length) {
      const dcStyle = styles[block.dropCap.style];
      const char = words[0][0];
      const w = measure(dcStyle.font, char);
      const dcHeight = block.dropCap.lines * lh;
      const free = freeIntervals(columns[col], y, dcHeight, input.exclusions, 0);
      const clear = free.length > 0 && free[0][0] <= columns[col].x + 0.5 && free[0][1] - free[0][0] >= w + 6 + minSegment;
      if (clear) {
        words[0] = words[0].slice(1);
        if (!words[0]) words = words.slice(1);
        const rect: Rect = { x: columns[col].x, y, w: w + 6, h: dcHeight };
        local.push(rect);
        dropCapBottom = rect.y + rect.h;
        out.push({
          id: nextId++,
          text: char,
          x: rect.x,
          y,
          baseline: y + (block.dropCap.lines - 1) * lh + style.baseline,
          w,
          style: block.dropCap.style,
          article: block.article,
          isDropCap: true,
        });
      }
    }

    let idx = 0;
    while (idx < words.length) {
      if (++guard > 50000) return { words: out, bottom: Math.max(maxBottom, y) };
      if (y + lh > bottomLimit) nextColumn();

      const intervals = freeIntervals(columns[col], y, lh, [...input.exclusions, ...local], minSegment);
      let placedOnLine = false;

      for (let k = 0; k < intervals.length && idx < words.length; k++) {
        const [a, b] = intervals[k];
        const width = b - a;
        const taken: { text: string; w: number }[] = [];
        let total = 0;
        while (idx < words.length) {
          const text = words[idx];
          const w = measure(style.font, text);
          const add = (taken.length ? spaceW : 0) + w;
          // A word wider than the whole column is placed anyway, so layout always advances.
          const forced = taken.length === 0 && w > width && w > columns[col].w * 0.95;
          if (total + add <= width || forced) {
            taken.push({ text, w });
            total += add;
            idx += 1;
          } else break;
        }
        if (!taken.length) continue;
        placedOnLine = true;

        const lastLine = idx >= words.length;
        // Justify to the edges, unless that would open ugly gaps (a line with few words): then set it ragged.
        const looseGap = taken.length > 1 ? (width - taken.reduce((s, t) => s + t.w, 0)) / (taken.length - 1) : spaceW;
        const justify = style.align === 'justify' && !lastLine && taken.length > 1 && looseGap <= spaceW * 2.8;
        const gap = justify ? looseGap : spaceW;
        let x = a;
        for (const t of taken) {
          out.push({ id: nextId++, text: t.text, x, y, baseline: y + style.baseline, w: t.w, style: block.style, article: block.article, isDropCap: false });
          x += t.w + gap;
        }
      }

      if (placedOnLine) maxBottom = Math.max(maxBottom, y + lh);
      y += lh; // always advance, even when nothing fitted on this line (e.g. a photo covers it)
    }

    y = Math.max(y, dropCapBottom);
    maxBottom = Math.max(maxBottom, y);
    y += style.spaceAfter;
  }

  return { words: out, bottom: maxBottom };
}
