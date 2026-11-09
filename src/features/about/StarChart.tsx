'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { CHART, CHART_EDGES, CHART_STARS, DEC_TICKS, ECLIPTIC, FIELDS, RA_TICKS } from './stars';
import styles from './stars.module.css';

/*
 * A star chart that tells the truth about where we are. It is the "teapot" of the archer constellation, drawn from its
 * real stars. Each of the six kinds of work we are building for is a star: the ones where we have made a first thing are
 * lit, and the rest are still dark, with an empty orbit, because we are listening and nothing is built there yet.
 * The key under the chart lists them all, and opens the one you choose: a small everyday example of the friction we want
 * to take out of that work, what exists, and where to go next (the work itself, or a conversation with us).
 */

const byId = new Map(CHART_STARS.map((star) => [star.id, star]));
const css = (vars: Record<string, string | number>) => vars as CSSProperties;

/** A repeatable scatter, so server and browser draw the same sky. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// The Milky Way runs through this part of the sky, from upper left to lower right, so faint stars crowd along that band.
const BAND = { x: 290, y: 235, angle: 27, width: 70 };
const bandDistance = (x: number, y: number) => {
  const a = (BAND.angle * Math.PI) / 180;
  return Math.abs((x - BAND.x) * -Math.sin(a) + (y - BAND.y) * Math.cos(a));
};

// faint background stars, kept clear of the chart's stars, names and edge marks
const BACKDROP = (() => {
  const rand = seeded(1846);
  const rooms = [
    ...CHART_STARS.map((star) => ({ x1: star.x - 20, x2: star.x + 20, y1: star.y - 20, y2: star.y + 20 })),
    ...FIELDS.map((field) => {
      const wide = field.label.length * 10.4 + 12;
      const { x, y, anchor = 'middle' } = field.labelAt;
      const x1 = anchor === 'start' ? x - 6 : anchor === 'end' ? x - wide : x - wide / 2;
      return { x1, x2: x1 + wide, y1: y - 24, y2: y + 10 };
    }),
    { x1: 330, x2: 500, y1: 380, y2: 404 }, // the note about the galactic centre
  ];
  const sky: { x: number; y: number; r: number; o: number; twinkle: boolean; delay: number }[] = [];
  let guard = 0;
  while (sky.length < 130 && guard++ < 4000) {
    const x = 34 + rand() * (CHART.w - 68);
    const y = 38 + rand() * (CHART.h - 76);
    const crowd = 0.3 + 1.2 * Math.exp(-((bandDistance(x, y) / BAND.width) ** 2) / 2);
    const r = 0.4 + rand() * 0.9;
    const o = 0.25 + rand() * 0.55;
    const twinkle = rand() > 0.72;
    const delay = rand() * 5;
    if (rand() * 1.5 > crowd) continue;
    if (rooms.some((room) => x > room.x1 && x < room.x2 && y > room.y1 && y < room.y2)) continue;
    sky.push({ x: +x.toFixed(1), y: +y.toFixed(1), r: +r.toFixed(2), o: +o.toFixed(2), twinkle, delay: +delay.toFixed(2) });
  }
  return sky;
})();

export default function StarChart() {
  const uid = useId().replace(/:/g, '');
  const plateRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string>(FIELDS[0].id); // the entry that is open in the key
  const [peekId, setPeekId] = useState<string | null>(null); // the star the pointer or keyboard is on, before it is chosen
  const lit = FIELDS.find((f) => f.id === (peekId ?? openId))!;
  const hot = lit.starId;

  // The lines draw themselves, and the stars come out, the first time the chart scrolls into view.
  useEffect(() => {
    const plate = plateRef.current;
    if (!plate) return;
    plate.dataset.armed = 'true';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        plate.dataset.in = 'true';
        observer.disconnect();
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(plate);
    return () => observer.disconnect();
  }, []);

  // The distant sky drifts a little against the chart as the cursor moves, which gives it depth.
  const drift = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const plate = event.currentTarget;
    const box = plate.getBoundingClientRect();
    plate.style.setProperty('--px', (((event.clientX - box.left) / box.width) * 2 - 1).toFixed(2));
    plate.style.setProperty('--py', (((event.clientY - box.top) / box.height) * 2 - 1).toFixed(2));
  };
  const rest = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--px', '0');
    event.currentTarget.style.setProperty('--py', '0');
  };
  // The page's typewriter listens for keys on the whole window and cancels Enter, Space and Tab; keep those for these controls.
  const keepKeys = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Tab') event.stopPropagation();
  };

  return (
    <div>
      <div ref={plateRef} className={`${styles.plate} postit-card`} onPointerMove={drift} onPointerLeave={rest}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          role="img"
          aria-label="A star chart. Each of six stars stands for a kind of work we are building for. Two are lit, where we have made a first thing, and four are dark, where nothing is built yet. The key below lists them."
        >
          <defs>
            <radialGradient id={`${uid}-band`}>
              <stop offset="0" stopColor="#f4ecd6" stopOpacity="0.14" />
              <stop offset="1" stopColor="#f4ecd6" stopOpacity="0" />
            </radialGradient>
            {CHART_STARS.map((star) => (
              <radialGradient key={star.id} id={`${uid}-h-${star.id}`}>
                <stop offset="0" stopColor={star.tint} stopOpacity="0.55" />
                <stop offset="1" stopColor={star.tint} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {/* the distant sky: the Milky Way, graticule, the Sun's path, and faint stars */}
          <g className={styles.far}>
            <ellipse cx={BAND.x} cy={BAND.y} rx="320" ry={BAND.width} transform={`rotate(${BAND.angle} ${BAND.x} ${BAND.y})`} fill={`url(#${uid}-band)`} />
            <g className={styles.grid}>
              {RA_TICKS.map((tick) => (
                <path key={tick.label} d={`M${tick.x} 16V424`} />
              ))}
              {DEC_TICKS.map((tick) => (
                <path key={tick.label} d={`M16 ${tick.y}H504`} />
              ))}
            </g>
            <path className={styles.ecliptic} d={ECLIPTIC} />
            <text className={styles.tick} x="30" y="27">
              ECLIPTIC
            </text>
            {BACKDROP.map((star, i) => (
              <circle
                key={i}
                className={star.twinkle ? `${styles.back} ${styles.twinkle}` : styles.back}
                style={star.twinkle ? { animationDelay: `${star.delay}s` } : undefined}
                cx={star.x}
                cy={star.y}
                r={star.r}
                opacity={star.o}
              />
            ))}
          </g>

          {/* the frame, with right ascension along the bottom and declination down the left */}
          <rect className={styles.frame} x="16" y="16" width={CHART.w - 32} height={CHART.h - 32} />
          <rect className={styles.frame} x="20" y="20" width={CHART.w - 40} height={CHART.h - 40} opacity="0.45" />
          {RA_TICKS.map((tick) => (
            <g key={tick.label}>
              <path className={styles.frame} d={`M${tick.x} 416V424`} />
              <text className={styles.tick} x={tick.x} y="410" textAnchor="middle">
                {tick.label}
              </text>
            </g>
          ))}
          {DEC_TICKS.map((tick) => (
            <g key={tick.label}>
              <path className={styles.frame} d={`M16 ${tick.y}H24`} />
              <text className={styles.tick} x="30" y={tick.y - 5}>
                {tick.label}
              </text>
            </g>
          ))}
          <text className={styles.tick} x="496" y="393" textAnchor="end">
            GALACTIC CENTRE →
          </text>

          {/* the teapot's lines */}
          {CHART_EDGES.map(([from, to], i) => {
            const a = byId.get(from)!;
            const b = byId.get(to)!;
            return (
              <path
                key={`${from}-${to}`}
                className={styles.edge}
                data-hot={from === hot || to === hot ? 'true' : 'false'}
                style={css({ '--i': i })}
                d={`M${a.x} ${a.y}L${b.x} ${b.y}`}
                pathLength={1}
              />
            );
          })}

          {/* the stars: lit where we have made something, dark (with an empty orbit) where we are still listening */}
          {CHART_STARS.map((star, i) => {
            const field = FIELDS.find((f) => f.starId === star.id);
            const state = field ? field.status : 'plain';
            const reach = star.r * (field ? 5.5 : 4);
            return (
              <g key={star.id} className={styles.star} data-state={state} data-active={hot === star.id ? 'true' : 'false'} style={css({ '--s': i })}>
                <circle className={styles.halo} cx={star.x} cy={star.y} r={star.r * 4.6} fill={`url(#${uid}-h-${star.id})`} />
                <path className={styles.spike} d={`M${star.x - reach} ${star.y}H${star.x + reach}M${star.x} ${star.y - reach}V${star.y + reach}`} />
                {field ? <circle className={styles.orbit} cx={star.x} cy={star.y} r={star.r + 7.5} /> : null}
                <circle className={styles.core} cx={star.x} cy={star.y} r={star.r} fill={star.tint} />
                {field ? <circle className={styles.ring} cx={star.x} cy={star.y} r={star.r + 7} /> : null}
              </g>
            );
          })}

          {/* what each one stands for */}
          {FIELDS.map((f, i) => (
            <text
              key={f.id}
              className={styles.label}
              data-state={f.status}
              data-active={hot === f.starId ? 'true' : 'false'}
              style={css({ '--s': i + 3 })}
              x={f.labelAt.x}
              y={f.labelAt.y}
              textAnchor={f.labelAt.anchor ?? 'middle'}
            >
              {f.label}
            </text>
          ))}
        </svg>

        {/* the touch target over each star (the key below is the keyboard and screen reader way in) */}
        {FIELDS.map((f) => {
          const star = byId.get(f.starId)!;
          return (
            <div
              key={f.id}
              aria-hidden="true"
              className={`${styles.hit} magnetic-target`}
              data-cursor-scale="1.6"
              style={{ left: `${(star.x / CHART.w) * 100}%`, top: `${(star.y / CHART.h) * 100}%` }}
              onPointerEnter={() => setOpenId(f.id)}
              onClick={() => setOpenId(f.id)}
            />
          );
        })}
      </div>

      {/* the key to the plate */}
      <div className={styles.key}>
        <p className={styles.keyTitle}>
          <span>Key to the plate</span>
          <span className={styles.legend}>
            <i className={styles.dotLit} /> first work <i className={styles.dotDark} /> listening
          </span>
        </p>
        <ul className={styles.rows}>
          {FIELDS.map((f) => {
            const open = openId === f.id;
            return (
              <li key={f.id} className={styles.row} data-open={open ? 'true' : 'false'} data-state={f.status}>
                <button
                  type="button"
                  className={styles.rowButton}
                  aria-expanded={open}
                  data-cursor-scale="1.4"
                  onClick={() => setOpenId(f.id)}
                  onPointerEnter={() => setPeekId(f.id)}
                  onPointerLeave={() => setPeekId(null)}
                  onFocus={() => setPeekId(f.id)}
                  onBlur={() => setPeekId(null)}
                  onKeyDown={keepKeys}
                >
                  <span className={styles.numeral}>{f.numeral}</span>
                  <span className={styles.name}>{f.label}</span>
                  <span className={styles.starName}>{f.starName}</span>
                  <span className={styles.chip}>{f.status === 'started' ? 'First work' : 'Listening'}</span>
                </button>
                {open ? (
                  <div className={styles.detail}>
                    <p className={styles.friction}>{f.friction}</p>
                    <p className={styles.work}>{f.work}</p>
                    <a className={styles.link} href={f.status === 'started' ? '#projects' : '#contact'} data-cursor-scale="1.4" onKeyDown={keepKeys}>
                      {f.status === 'started' ? 'See the work' : 'Tell us what slows you down'} <span aria-hidden="true">→</span>
                    </a>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
