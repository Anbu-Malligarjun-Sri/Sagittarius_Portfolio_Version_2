// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { freeIntervals, layoutBlocks, type Block, type TextStyle } from './layoutEngine';

// Every character is 10px wide, so widths are easy to reason about.
const measure = (_font: string, text: string) => text.length * 10;

const body: TextStyle = { font: 'body', size: 14, lineHeight: 20, align: 'justify', spaceBefore: 0, spaceAfter: 10, baseline: 15 };
const head: TextStyle = { font: 'head', size: 24, lineHeight: 28, align: 'left', spaceBefore: 6, spaceAfter: 4, baseline: 22, minLines: 3 };
const cap: TextStyle = { font: 'cap', size: 50, lineHeight: 60, align: 'left', spaceBefore: 0, spaceAfter: 0, baseline: 44 };
const styles = { body, head, cap };

const words = (n: number, len = 4) => Array.from({ length: n }, (_, i) => String.fromCharCode(97 + (i % 26)).repeat(len));
const base = { styles, top: 0, columnHeight: 200, exclusions: [], measure, columns: [{ x: 0, w: 200 }] };

describe('freeIntervals', () => {
  it('returns the whole column when nothing is in the way', () => {
    expect(freeIntervals({ x: 0, w: 200 }, 0, 20, [])).toEqual([[0, 200]]);
  });

  it('splits a line around a rectangle that overlaps its band, and ignores one that does not', () => {
    const rect = { x: 80, y: 10, w: 40, h: 30 };
    expect(freeIntervals({ x: 0, w: 200 }, 0, 20, [rect])).toEqual([[0, 80], [120, 200]]);
    expect(freeIntervals({ x: 0, w: 200 }, 50, 20, [rect])).toEqual([[0, 200]]);
  });

  it('drops slivers narrower than the minimum', () => {
    expect(freeIntervals({ x: 0, w: 200 }, 0, 20, [{ x: 30, y: 0, w: 160, h: 50 }], 40)).toEqual([]);
  });
});

describe('layoutBlocks', () => {
  it('breaks a paragraph into lines that fit the column and justifies all but the last', () => {
    const block: Block = { style: 'body', words: words(12), article: 0 };
    const { words: placed } = layoutBlocks({ ...base, blocks: [block] });
    const lines = new Map<number, typeof placed>();
    placed.forEach((w) => lines.set(w.y, [...(lines.get(w.y) ?? []), w]));
    const ys = [...lines.keys()].sort((a, b) => a - b);
    expect(placed).toHaveLength(12);
    for (const y of ys) for (const w of lines.get(y)!) expect(w.x + w.w).toBeLessThanOrEqual(200.0001);
    const firstLine = lines.get(ys[0])!;
    expect(firstLine[firstLine.length - 1].x + firstLine[firstLine.length - 1].w).toBeCloseTo(200, 3); // justified to the edge
    const lastLine = lines.get(ys[ys.length - 1])!;
    expect(lastLine[0].x).toBe(0);
  });

  it('does not justify a line when that would open huge gaps', () => {
    // Two 40px words in a 200px column: justifying would leave a 120px gap, so the line is set ragged instead.
    const block: Block = { style: 'body', words: ['aaaa', 'bbbb', 'cccc', 'dddd', 'eeee', 'ffff', 'gggg'], article: 0 };
    const { words: placed } = layoutBlocks({ ...base, blocks: [block], columns: [{ x: 0, w: 130 }] });
    const firstLine = placed.filter((w) => w.y === 0);
    expect(firstLine.length).toBeGreaterThan(1);
    const gap = firstLine[1].x - (firstLine[0].x + firstLine[0].w);
    expect(gap).toBeLessThanOrEqual(10 * 2.8 + 0.001);
  });

  it('flows text on both sides of a photograph, in reading order', () => {
    const block: Block = { style: 'body', words: words(40), article: 0 };
    const photo = { x: 80, y: 0, w: 40, h: 60 };
    const { words: placed } = layoutBlocks({ ...base, columnHeight: 400, blocks: [block], exclusions: [photo] });
    const onPhotoLines = placed.filter((w) => w.y < 60);
    expect(onPhotoLines.length).toBeGreaterThan(0);
    for (const w of onPhotoLines) {
      const overlapsPhoto = w.x < photo.x + photo.w && w.x + w.w > photo.x;
      expect(overlapsPhoto).toBe(false); // nothing is printed on the picture
    }
    expect(onPhotoLines.some((w) => w.x >= photo.x + photo.w)).toBe(true); // text continues to the right of it
    expect(onPhotoLines.some((w) => w.x + w.w <= photo.x)).toBe(true); // and starts to the left of it
    expect(placed.map((w) => w.id)).toEqual([...placed.map((w) => w.id)].sort((a, b) => a - b)); // ids follow reading order
  });

  it('leaves a line empty when the photograph leaves no usable gap, then continues below it', () => {
    const block: Block = { style: 'body', words: words(10), article: 0 };
    const wall = { x: 0, y: 0, w: 200, h: 40 };
    const { words: placed } = layoutBlocks({ ...base, columnHeight: 400, blocks: [block], exclusions: [wall] });
    expect(Math.min(...placed.map((w) => w.y))).toBeGreaterThanOrEqual(40);
  });

  it('moves on to the next column when the first is full', () => {
    const block: Block = { style: 'body', words: words(80), article: 0 };
    const { words: placed } = layoutBlocks({
      ...base,
      blocks: [block],
      columns: [{ x: 0, w: 100 }, { x: 150, w: 100 }],
      columnHeight: 100,
    });
    expect(placed.some((w) => w.x >= 150)).toBe(true);
    expect(placed.filter((w) => w.x < 100).every((w) => w.y + 20 <= 100)).toBe(true);
  });

  it('starts a headline in the next column when there is not room for it to stay with its text', () => {
    const intro: Block = { style: 'body', words: words(14), article: 0 }; // fills most of the first column
    const headline: Block = { style: 'head', words: ['Big', 'news'], article: 1 };
    const { words: placed } = layoutBlocks({
      ...base,
      blocks: [intro, headline],
      columns: [{ x: 0, w: 200 }, { x: 250, w: 200 }],
      columnHeight: 130,
    });
    expect(placed.filter((w) => w.style === 'head').every((w) => w.x >= 250)).toBe(true);
  });

  it('places a drop cap and wraps the first lines beside it', () => {
    const block: Block = { style: 'body', words: ['Once'].concat(words(30)), article: 0, dropCap: { style: 'cap', lines: 3 } };
    const { words: placed } = layoutBlocks({ ...base, columnHeight: 400, blocks: [block] });
    const initial = placed.find((w) => w.isDropCap)!;
    expect(initial.text).toBe('O');
    expect(initial.style).toBe('cap');
    const beside = placed.filter((w) => !w.isDropCap && w.y < 60);
    expect(beside.length).toBeGreaterThan(0);
    for (const w of beside) expect(w.x).toBeGreaterThanOrEqual(initial.x + initial.w);
  });

  it('skips the drop cap (instead of printing it under a photograph) when the left edge is blocked', () => {
    const block: Block = { style: 'body', words: ['Once'].concat(words(40)), article: 0, dropCap: { style: 'cap', lines: 3 } };
    const photo = { x: 0, y: 0, w: 90, h: 100 }; // covers the left edge of the column
    const { words: placed } = layoutBlocks({ ...base, columnHeight: 600, blocks: [block], exclusions: [photo] });
    expect(placed.some((w) => w.isDropCap)).toBe(false);
    expect(placed.find((w) => w.text === 'Once')).toBeDefined(); // the first word is intact
    for (const w of placed) {
      const overlapsPhoto = w.x < photo.x + photo.w && w.x + w.w > photo.x && w.y < photo.y + photo.h && w.y + 20 > photo.y;
      expect(overlapsPhoto).toBe(false);
    }
  });

  it('keeps word ids stable when only the exclusions change (so words can glide between layouts)', () => {
    const block: Block = { style: 'body', words: words(30), article: 0 };
    const a = layoutBlocks({ ...base, columnHeight: 400, blocks: [block] });
    const b = layoutBlocks({ ...base, columnHeight: 400, blocks: [block], exclusions: [{ x: 60, y: 20, w: 80, h: 60 }] });
    expect(a.words.map((w) => w.text)).toEqual(b.words.map((w) => w.text));
    expect(a.words.map((w) => w.id)).toEqual(b.words.map((w) => w.id));
    expect(a.words.some((w, i) => w.x !== b.words[i].x || w.y !== b.words[i].y)).toBe(true); // and they did move
  });

  it('always terminates, even if a word is wider than the column', () => {
    const block: Block = { style: 'body', words: ['x'.repeat(40), 'ok'], article: 0 };
    const { words: placed } = layoutBlocks({ ...base, blocks: [block], columns: [{ x: 0, w: 100 }] });
    expect(placed).toHaveLength(2);
  });
});
