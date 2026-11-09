'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Artefact } from './BoardArt';
import { PROCESS_FACTS, STAGES } from './stages';
import type { Stage } from './stages';
import styles from './board.module.css';

/*
 * "How it works" as an investigation board: one photograph, clipping or note pinned up for each stage of the software
 * development lifecycle, joined in order by red thread, the way a detective maps a case. Click a piece of evidence to
 * open its case file. The threads are drawn from the pins' real positions, so they stay attached at any screen size.
 */

const css = (vars: Record<string, string | number>) => vars as CSSProperties;

// How each piece hangs on the board: its tilt, how far down from the top of its slot it is pinned, and a sideways nudge.
const HANG = [
  { rot: -3, pt: 22, dx: -4 },
  { rot: 2.4, pt: 40, dx: 6 },
  { rot: -1.6, pt: 16, dx: -2 },
  { rot: 2.8, pt: 36, dx: 4 },
  { rot: -2.6, pt: 20, dx: -6 },
  { rot: 1.8, pt: 42, dx: 3 },
];

const PIN_COLOURS = ['#e24a4a', '#3f84e8', '#e8b83f', '#3fb77a', '#b45be0', '#ef7d3a'];

type Point = { x: number; y: number };
type Layout = { pins: Point[]; threads: { d: string; mid: Point; loop: boolean }[] };

/** A thread hung between two pins, sagging a little under its own weight. */
function threadBetween(a: Point, b: Point, boardWidth: number, loop: boolean) {
  const dx = b.x - a.x;
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  let cx = midX;
  let cy = midY + Math.min(46, 14 + Math.hypot(dx, b.y - a.y) * 0.1);
  if (Math.abs(dx) < 40) {
    // pins in the same column: bow the thread sideways, toward the middle of the board
    cx = midX + (midX > boardWidth / 2 ? -38 : 38);
    cy = midY + 6;
  }
  return {
    d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
    mid: { x: 0.25 * a.x + 0.5 * cx + 0.25 * b.x, y: 0.25 * a.y + 0.5 * cy + 0.25 * b.y },
    loop,
  };
}

function Details({ stage }: { stage: Stage }) {
  return (
    <dl className={styles.details}>
      <div>
        <dt>Evidence · you receive</dt>
        <dd>
          <ul>
            {stage.receive.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </dd>
      </div>
      <div>
        <dt>Your call · you decide</dt>
        <dd>{stage.decide}</dd>
      </div>
      <div>
        <dt>Checkpoint</dt>
        <dd>
          <span className={styles.sign}>
            <Check className="h-3.5 w-3.5" strokeWidth={3} /> {stage.checkpoint}
          </span>
        </dd>
      </div>
    </dl>
  );
}

export default function EvidenceBoard() {
  const uid = useId().replace(/:/g, '');
  const boardRef = useRef<HTMLDivElement>(null);
  const anchorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focus, setFocus] = useState(0);
  const [layout, setLayout] = useState<Layout>({ pins: [], threads: [] });

  // The pins and threads go up the first time the board scrolls into view.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    board.dataset.armed = 'true';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        board.dataset.in = 'true';
        observer.disconnect();
      },
      // Any part of the board coming into view starts it. (A percentage of the board would never be reached on a phone,
      // where the board is several screens tall.)
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  // Work out where each pin is, and string the threads between them. Runs whenever the board changes size.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const measure = () => {
      // The observer can fire once more while the page is being left, after React has already cleared the refs.
      const anchors = anchorRefs.current.filter((el): el is HTMLSpanElement => el !== null && el.isConnected);
      if (!board.isConnected || anchors.length !== STAGES.length) return;

      const box = board.getBoundingClientRect();
      const pins = anchors.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      const threads = pins.slice(1).map((pin, i) => threadBetween(pins[i], pin, box.width, false));
      // When the last and first photographs are in the same column, a final thread closes the loop: support feeds the next cycle.
      const first = pins[0];
      const last = pins[pins.length - 1];
      if (Math.abs(last.x - first.x) < 40) threads.push(threadBetween(last, first, box.width, true));
      setLayout({ pins, threads });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  const step = useCallback((delta: number) => {
    setFocus((current) => (current + delta + STAGES.length) % STAGES.length);
  }, []);

  const stage = STAGES[focus];
  const loopThread = layout.threads.find((thread) => thread.loop);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.62fr_1fr] lg:items-start">
      <div className={styles.frame}>
        <div ref={boardRef} className={styles.board}>
          <ol className={styles.grid}>
            {STAGES.map((item, i) => {
              const hang = HANG[i];
              return (
                <li
                  key={item.id}
                  className={`${styles.cell} ${styles[`pos${i}`]}`}
                  style={css({ '--pt': `${hang.pt}px`, '--dx': `${hang.dx}px`, '--rot': `${hang.rot}deg`, '--i': i })}
                >
                  <div className={styles.slot}>
                    <span
                      ref={(el) => {
                        anchorRefs.current[i] = el;
                      }}
                      className={styles.anchor}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      className={styles.item}
                      data-focus={focus === i ? 'true' : 'false'}
                      data-cursor-scale="1.6"
                      aria-pressed={focus === i}
                      aria-label={`Open case file ${item.number}: ${item.title}`}
                      onClick={() => setFocus(i)}
                      onFocus={() => setFocus(i)}
                    >
                      <span className={styles.drop}>
                        <Artefact id={item.id} />
                        <span className={styles.label}>
                          {item.number} · {item.label}
                        </span>
                        <svg className={styles.mark} viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
                          <path d="M12 52C10 24 52 8 104 9C158 10 196 26 192 52C188 80 146 94 96 92C46 90 14 78 14 50C14 38 26 28 44 20" />
                        </svg>
                      </span>
                    </button>
                  </div>

                  {/* below the desktop width the case file has no room beside the board, so it sits under each photograph */}
                  <div className={styles.note}>
                    <h3>{item.title}</h3>
                    <p>{item.happens}</p>
                    <Details stage={item} />
                  </div>
                </li>
              );
            })}
          </ol>

          <svg className={styles.overlay} aria-hidden="true">
            <defs>
              <radialGradient id={`${uid}-sheen`} cx="0.35" cy="0.3" r="0.8">
                <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
                <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity="0.4" />
              </radialGradient>
            </defs>
            {layout.threads.map((thread, i) => (
              <g key={i} className={thread.loop ? styles.loop : undefined} style={css({ '--t': i })}>
                <path className={styles.threadShadow} d={thread.d} pathLength={1} transform="translate(2 3)" />
                <path className={styles.thread} d={thread.d} pathLength={1} />
              </g>
            ))}
            {loopThread ? (
              <g transform={`translate(${loopThread.mid.x.toFixed(1)} ${loopThread.mid.y.toFixed(1)}) rotate(-5)`}>
                <g className={styles.tag}>
                  <rect x="-38" y="-10" width="76" height="20" rx="2" fill="#f4ead0" stroke="#bda776" />
                  <text y="4.6" textAnchor="middle" fontSize="13" fill="#3b2a16" style={{ fontFamily: 'var(--font-handwriting), cursive' }}>
                    next cycle
                  </text>
                </g>
              </g>
            ) : null}
            {layout.pins.map((pin, i) => (
              <g key={i} transform={`translate(${pin.x.toFixed(1)} ${pin.y.toFixed(1)})`}>
                <g className={styles.pin} style={css({ '--i': i })}>
                  <ellipse cx="3" cy="7" rx="7" ry="3" fill="rgba(0,0,0,0.35)" />
                  <circle r="7.5" fill={PIN_COLOURS[i]} />
                  <circle r="7.5" fill={`url(#${uid}-sheen)`} />
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className={styles.folderWrap}>
          <div className={styles.folder}>
            <span className={styles.folderTab}>Case file Nº {stage.number}</span>
            <svg className={styles.paperclip} viewBox="0 0 24 60" aria-hidden="true">
              <path d="M8 20V8a4 4 0 0 1 8 0v36a7 7 0 0 1-14 0V16" fill="none" stroke="#8d949c" strokeWidth="2.2" strokeLinecap="round" transform="translate(4 0)" />
            </svg>
            <div key={stage.id} className={styles.paper}>
              <p className={styles.kicker}>
                Stage {stage.number} of {String(STAGES.length).padStart(2, '0')}
              </p>
              <h3 className={styles.fileTitle}>{stage.title}</h3>
              <p className={styles.happens}>{stage.happens}</p>
              <Details stage={stage} />
            </div>

            <div className={styles.fileNav}>
              <button type="button" aria-label="Previous case file" data-cursor-scale="1.6" onClick={() => step(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span>
                {stage.number} / {String(STAGES.length).padStart(2, '0')}
              </span>
              <button type="button" aria-label="Next case file" data-cursor-scale="1.6" onClick={() => step(1)}>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <ul className={styles.facts}>
              <li className={styles.hintLine}>Click any photograph on the board to open its file.</li>
              {PROCESS_FACTS.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
