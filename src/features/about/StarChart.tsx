'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { CHART, CHART_EDGES, CHART_STARS, DEC_TICKS, ECLIPTIC, FIELDS, RA_TICKS } from './stars';
import styles from './stars.module.css';

/*
 * A star chart: the "teapot" of the archer constellation, with five of its real stars standing for the kinds of work we
 * are building for. Hover, focus or tap a star and it lights, with the lines that meet at it, and a catalogue note below
 * gives the star's traditional name and a small everyday example of the friction we want to take out of that work.
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

// faint background stars, kept clear of the chart's stars, names and edge marks
const BACKDROP = (() => {
  const rand = seeded(1846);
  const rooms = [
    ...CHART_STARS.map((star) => ({ x1: star.x - 20, x2: star.x + 20, y1: star.y - 20, y2: star.y + 20 })),
    ...FIELDS.map((field) => {
      const half = field.label.length * 5.2 + 10;
      return { x1: field.labelAt.x - half, x2: field.labelAt.x + half, y1: field.labelAt.y - 24, y2: field.labelAt.y + 10 };
    }),
  ];
  const sky: { x: number; y: number; r: number; o: number; twinkle: boolean; delay: number }[] = [];
  while (sky.length < 110) {
    const x = 34 + rand() * (CHART.w - 68);
    const y = 38 + rand() * (CHART.h - 76);
    const r = 0.4 + rand() * 0.9;
    const o = 0.25 + rand() * 0.55;
    const twinkle = rand() > 0.72;
    const delay = rand() * 5;
    if (rooms.some((room) => x > room.x1 && x < room.x2 && y > room.y1 && y < room.y2)) continue;
    sky.push({ x: +x.toFixed(1), y: +y.toFixed(1), r: +r.toFixed(2), o: +o.toFixed(2), twinkle, delay: +delay.toFixed(2) });
  }
  return sky;
})();

export default function StarChart() {
  const uid = useId().replace(/:/g, '');
  const plateRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const field = FIELDS.find((f) => f.id === activeId) ?? null;
  const hot = field?.starId ?? null;

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
  // The page's typewriter listens for keys on the whole window and cancels Enter, Space and Tab; keep those for the stars.
  const keepKeys = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Tab') event.stopPropagation();
  };

  return (
    <div>
      <div ref={plateRef} className={`${styles.plate} postit-card`} onPointerMove={drift} onPointerLeave={rest}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          role="img"
          aria-label="A star chart. Five of its stars stand for the kinds of work we are building for: biology, physics, chemistry, mathematics, and cafés, shops and homes."
        >
          <defs>
            <radialGradient id={`${uid}-halo`}>
              <stop offset="0" stopColor="#fff3cf" stopOpacity="0.5" />
              <stop offset="1" stopColor="#fff3cf" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* the distant sky: graticule, the Sun's path, and faint stars */}
          <g className={styles.far}>
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

          {/* the stars */}
          {CHART_STARS.map((star, i) => {
            const isField = FIELDS.some((f) => f.starId === star.id);
            const lit = hot === star.id;
            const reach = star.r * (isField ? 5.5 : 4);
            return (
              <g key={star.id} className={styles.star} data-active={lit ? 'true' : 'false'} style={css({ '--s': i })}>
                <circle className={styles.halo} cx={star.x} cy={star.y} r={star.r * 4.6} fill={`url(#${uid}-halo)`} />
                <path className={styles.spike} d={`M${star.x - reach} ${star.y}H${star.x + reach}M${star.x} ${star.y - reach}V${star.y + reach}`} />
                <circle className={styles.core} cx={star.x} cy={star.y} r={star.r} />
                {isField ? <circle className={styles.ring} cx={star.x} cy={star.y} r={star.r + 7} /> : null}
              </g>
            );
          })}

          {/* what each one stands for */}
          {FIELDS.map((f, i) => (
            <text key={f.id} className={styles.label} data-active={hot === f.starId ? 'true' : 'false'} style={css({ '--s': i + 3 })} x={f.labelAt.x} y={f.labelAt.y}>
              {f.label}
            </text>
          ))}
        </svg>

        {FIELDS.map((f) => {
          const star = byId.get(f.starId)!;
          return (
            <button
              key={f.id}
              type="button"
              className={styles.hit}
              style={{ left: `${(star.x / CHART.w) * 100}%`, top: `${(star.y / CHART.h) * 100}%` }}
              aria-pressed={activeId === f.id}
              aria-label={`${f.label}, the star ${f.starName}. Where friction hides: ${f.friction}`}
              data-cursor-scale="1.6"
              onPointerEnter={() => setActiveId(f.id)}
              onFocus={() => setActiveId(f.id)}
              onClick={() => setActiveId(f.id)}
              onKeyDown={keepKeys}
            />
          );
        })}
      </div>

      {/* the catalogue note for the star that is lit */}
      <div className={styles.note}>
        <p key={`k-${activeId ?? 'none'}`} className={styles.noteKicker}>
          {field ? `${field.label} · ${field.starName}` : 'The work we are mapping'}
        </p>
        <p key={`b-${activeId ?? 'none'}`} className={styles.noteBody}>
          {field ? field.friction : 'Friction is the small, daily drag on good work. Each star is a kind of work where we think it hides.'}
        </p>
        <p className={styles.noteSmall}>{field ? 'An everyday example of friction in this kind of work.' : ' '}</p>
      </div>
    </div>
  );
}
