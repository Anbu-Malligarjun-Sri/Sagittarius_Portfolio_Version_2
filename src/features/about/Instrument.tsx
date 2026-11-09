'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { FIELDS } from './fields';
import { frictionNoise, SIGNALS, sparkPath, spectrumStops } from './signals';
import type { Series, Signal } from './signals';
import styles from './instrument.module.css';

/*
 * An instrument that shows what we are for. Each kind of work we are building for has a signature signal, the trace its
 * scientists look at every day (a DNA read, the spectrum of hydrogen, a titration curve...). Friction is drawn as noise
 * on that signal. Drag the control to ease the friction away and the signal, and what it means, becomes plain.
 *
 * These are illustrations of each signal's shape, not measured data, and the caption says so.
 */

const VIEW = { w: 520, h: 292 };
const PLOT = { x: 54, y: 46, w: 442, h: 188 };
const COLS = 240;
const MAX_SERIES = 4;
const REDUCED = '(prefers-reduced-motion: reduce)';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const px = (x: number) => PLOT.x + x * PLOT.w;
const py = (y: number) => PLOT.y + PLOT.h * (1 - y);

type Mix = { from: Signal; to: Signal; p: number; t: number; ease: number };

const SPARKS = new Map(SIGNALS.map((signal) => [signal.id, sparkPath(signal, 96, 24)]));
const signalOf = (id: string) => SIGNALS.find((signal) => signal.id === id)!;
const SPECTRUM = spectrumStops();
const css = (vars: Record<string, string>) => vars as CSSProperties;

export default function Instrument() {
  const panelRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const fillRefs = useRef<(SVGPathElement | null)[]>([]);
  const mixRef = useRef<Mix>({ from: SIGNALS[0], to: SIGNALS[0], p: 1, t: 2.4, ease: 0.06 });
  const wakeRef = useRef<() => void>(() => {});
  const reducedRef = useRef(false);
  const touchedRef = useRef(false);

  const [ease, setEase] = useState(0.06); // 0 = a lot of friction, 1 = none
  const [openId, setOpenId] = useState<string>(FIELDS[0].id); // the entry that is open in the list
  const [peekId, setPeekId] = useState<string | null>(null); // the entry the pointer or keyboard is on
  const shown = signalOf(peekId ?? openId);

  // Draw the current signals onto the paths.
  const draw = (mix: Mix) => {
    const friction = 1 - mix.ease;
    const e = easeInOut(mix.p);
    for (let s = 0; s < MAX_SERIES; s++) {
      const line = lineRefs.current[s];
      const fill = fillRefs.current[s];
      if (!line || !fill) continue;
      const a: Series | undefined = mix.from.series[s];
      const b: Series | undefined = mix.to.series[s];
      const alpha = lerp(a ? 1 : 0, b ? 1 : 0, e);
      if (alpha < 0.002) {
        line.setAttribute('d', '');
        fill.setAttribute('d', '');
        continue;
      }
      const target = (b ?? a)!;
      const jitter = target.noisy !== false;
      const points: string[] = [];
      for (let i = 0; i <= COLS; i++) {
        const x = i / COLS;
        const clean = lerp(a ? a.at(x, friction) : 0, b ? b.at(x, friction) : 0, e);
        const noise = jitter ? frictionNoise(x, mix.t, friction, s * 1.37 + 0.4) : 0;
        const y = clamp(clean + noise, -0.06, 1.1);
        points.push(`${px(x).toFixed(1)} ${py(y).toFixed(1)}`);
      }
      const d = `M${points.join('L')}`;
      // a series with colour stops is painted with that gradient; otherwise with its one colour
      const paint = b?.gradient ? `url(#inst-g-${s})` : target.color;
      line.setAttribute('d', d);
      line.setAttribute('stroke', paint);
      line.setAttribute('opacity', alpha.toFixed(2));
      line.style.strokeWidth = String(target.width ?? 1.3);
      line.style.strokeDasharray = target.dash ?? '';
      // pathLength=1 makes dash lengths count in fractions of the line, so a dashed series must not carry it
      if (target.dash) line.removeAttribute('pathLength');
      else line.setAttribute('pathLength', '1');
      fill.setAttribute('d', `${d}L${px(1)} ${py(-0.06).toFixed(1)}L${px(0)} ${py(-0.06).toFixed(1)}Z`);
      fill.setAttribute('fill', paint);
      fill.setAttribute('opacity', target.fill === false ? '0' : (alpha * 0.1).toFixed(3));
    }
  };

  // The loop: it draws while anything is moving (a change of signal, or noise still on the trace) and sleeps otherwise.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    reducedRef.current = window.matchMedia?.(REDUCED).matches ?? false;
    let raf = 0;
    let last = 0;
    let running = false;
    let visible = true;
    let disposed = false;

    const frame = (now: number) => {
      raf = 0;
      if (disposed) return;
      const mix = mixRef.current;
      const elapsed = (now - last) / 1000;
      const dt = Math.min(0.05, elapsed);
      last = now;
      // The change of signal follows real time, so it takes the same 0.45 s however slowly the screen is drawing;
      // only the drifting of the noise is held back to small steps.
      if (mix.p < 1) mix.p = Math.min(1, mix.p + Math.min(0.25, elapsed) / 0.45);
      if (!reducedRef.current) mix.t += dt;
      draw(mix);
      const noisy = 1 - mix.ease > 0.012 && !reducedRef.current;
      if ((mix.p < 1 || noisy) && visible) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const wake = () => {
      if (running || disposed) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;
    draw(mixRef.current); // there is a trace on the screen from the start

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
      },
      { rootMargin: '120px' },
    );
    observer.observe(panel);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      wakeRef.current = () => {};
    };
  }, []);

  // Switch to another signal: the trace morphs across.
  useEffect(() => {
    const mix = mixRef.current;
    if (mix.to.id === shown.id) return;
    mix.from = mix.to;
    mix.to = shown;
    mix.p = reducedRef.current ? 1 : 0;
    wakeRef.current();
  }, [shown]);

  // The control moved: more or less noise.
  useEffect(() => {
    mixRef.current.ease = ease;
    wakeRef.current();
  }, [ease]);

  // The first time the instrument scrolls into view the traces are drawn in, and the friction eases away by itself, as a
  // demonstration, unless the visitor has already taken hold of the control.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.dataset.armed = 'true';
    let raf = 0;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        panel.dataset.in = 'true';
        if (reducedRef.current) {
          if (!touchedRef.current) setEase(0.94);
          return;
        }
        timer = window.setTimeout(() => {
          const start = performance.now();
          const from = mixRef.current.ease;
          const step = (now: number) => {
            if (touchedRef.current) return;
            const t = Math.min(1, (now - start) / 3800);
            setEase(from + (0.94 - from) * (1 - (1 - t) ** 3));
            if (t < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }, 900);
      },
      { threshold: 0.35 },
    );
    observer.observe(panel);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  // The page's typewriter listens for keys on the whole window and cancels Enter, Space, Tab and the arrow keys; keep those for these controls.
  const keepKeys = (event: KeyboardEvent<HTMLElement>) => {
    if (['Enter', ' ', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) event.stopPropagation();
  };

  const labelsShow = clamp((ease - 0.4) / 0.45, 0, 1);

  return (
    <div data-field={shown.id} style={css({ '--accent': shown.accent })}>
      <div ref={panelRef} className={styles.panel} data-field={shown.id}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          role="img"
          aria-label={`Figure: ${shown.title}. An illustration of the signal this kind of work produces, with friction drawn as noise on it. It is not measured data.`}
        >
          <defs>
            <clipPath id="instrument-plot">
              <rect x={PLOT.x} y={PLOT.y} width={PLOT.w} height={PLOT.h} />
            </clipPath>
            {shown.series.map((series, i) =>
              series.gradient ? (
                <linearGradient key={`${shown.id}-${i}`} id={`inst-g-${i}`} gradientUnits="userSpaceOnUse" x1={PLOT.x} y1="0" x2={PLOT.x + PLOT.w} y2="0">
                  {series.gradient.map((stop) => (
                    <stop key={stop.at} offset={stop.at} stopColor={stop.color} />
                  ))}
                </linearGradient>
              ) : null,
            )}
            <linearGradient id="inst-spectrum" gradientUnits="userSpaceOnUse" x1={PLOT.x} y1="0" x2={PLOT.x + PLOT.w} y2="0">
              {SPECTRUM.map((stop) => (
                <stop key={stop.at} offset={stop.at} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>

          <text className={styles.figure} x={PLOT.x} y="26">
            FIG. {FIELDS.findIndex((f) => f.id === shown.id) + 1} · {shown.title.toUpperCase()}
          </text>
          <text className={styles.tick} x={VIEW.w - 24} y="26" textAnchor="end">
            ILLUSTRATION
          </text>

          {/* the graticule, like the screen of an instrument */}
          <g className={styles.grid}>
            {Array.from({ length: 9 }, (_, i) => (
              <path key={`v${i}`} d={`M${px((i + 1) / 10)} ${PLOT.y}V${PLOT.y + PLOT.h}`} />
            ))}
            {Array.from({ length: 4 }, (_, i) => (
              <path key={`h${i}`} d={`M${PLOT.x} ${py((i + 1) / 5)}H${PLOT.x + PLOT.w}`} />
            ))}
          </g>
          <path className={styles.axis} d={`M${PLOT.x} ${PLOT.y}V${PLOT.y + PLOT.h}H${PLOT.x + PLOT.w}`} />

          {/* ticks and titles for this signal's axes */}
          {shown.axes.x.ticks.map((tick) => (
            <g key={`x${tick.at}`}>
              <path className={styles.axis} d={`M${px(tick.at)} ${PLOT.y + PLOT.h}v4`} />
              <text className={styles.tick} x={px(tick.at)} y={PLOT.y + PLOT.h + 16} textAnchor="middle">
                {tick.label}
              </text>
            </g>
          ))}
          {shown.axes.y.ticks.map((tick) => (
            <g key={`y${tick.at}`}>
              <path className={styles.axis} d={`M${PLOT.x - 4} ${py(tick.at)}h4`} />
              <text className={styles.tick} x={PLOT.x - 8} y={py(tick.at) + 3} textAnchor="end">
                {tick.label}
              </text>
            </g>
          ))}
          <text className={styles.axisTitle} x={PLOT.x + PLOT.w / 2} y={PLOT.y + PLOT.h + 34} textAnchor="middle">
            {shown.axes.x.title}
          </text>
          <text className={styles.axisTitle} transform={`rotate(-90 15 ${PLOT.y + PLOT.h / 2})`} x="15" y={PLOT.y + PLOT.h / 2} textAnchor="middle">
            {shown.axes.y.title}
          </text>

          {/* for a spectrum, the colours of the visible light along the bottom, as a spectrometer shows them */}
          {shown.spectrumStrip ? <rect className={styles.strip} x={PLOT.x} y={PLOT.y + PLOT.h - 8} width={PLOT.w} height="8" fill="url(#inst-spectrum)" /> : null}

          {/* the traces */}
          <g clipPath="url(#instrument-plot)">
            {shown.guides.map((guide) => (
              <path key={guide} className={styles.guide} d={`M${px(guide)} ${PLOT.y}V${PLOT.y + PLOT.h}`} />
            ))}
            {Array.from({ length: MAX_SERIES }, (_, s) => (
              <g key={s}>
                <path
                  ref={(el) => {
                    fillRefs.current[s] = el;
                  }}
                  className={styles.fill}
                />
                <path
                  ref={(el) => {
                    lineRefs.current[s] = el;
                  }}
                  className={styles.line}
                  pathLength={1}
                />
              </g>
            ))}
          </g>

          {/* words written on the signal: they only become readable once the friction has gone */}
          <g style={{ opacity: labelsShow }} className={styles.labels}>
            {shown.labels.map((label) => (
              <text
                key={`${label.text}-${label.x}`}
                className={label.text.length === 1 ? styles.base : styles.note}
                fill={label.color}
                x={px(label.x) + (label.anchor === 'end' ? -6 : label.anchor === 'start' ? 6 : 0)}
                y={py(Math.min(label.y, 1.06)) - 3}
                textAnchor={label.anchor ?? 'middle'}
              >
                {label.text}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* the friction control */}
      <div className={styles.control}>
        <span>Raw</span>
        <label className={styles.rangeWrap}>
          <span className={styles.rangeTitle}>Friction</span>
          <input
            type="range"
            className={styles.range}
            min={0}
            max={1}
            step={0.01}
            value={ease}
            aria-label="Friction. Drag to the right to ease it away."
            aria-valuetext={ease > 0.85 ? 'Almost no friction' : ease > 0.5 ? 'Some friction' : 'A lot of friction'}
            data-cursor-scale="1.4"
            onChange={(event) => {
              touchedRef.current = true;
              setEase(Number(event.target.value));
            }}
            onKeyDown={keepKeys}
          />
        </label>
        <span>Eased</span>
      </div>
      <p className={`${styles.caption} postit-card`}>Illustrations of the kind of signal each field works with. Not measured data.</p>

      {/* the list: one entry for each kind of work */}
      <div className={styles.key}>
        <p className={styles.keyTitle}>
          <span>What we are building for</span>
          <span className={styles.legend}>
            <i className={styles.dotLit} /> first work <i className={styles.dotDark} /> listening
          </span>
        </p>
        <ul className={styles.rows}>
          {FIELDS.map((f) => {
            const open = openId === f.id;
            return (
              <li key={f.id} className={styles.row} data-open={open ? 'true' : 'false'} data-state={f.status} data-field={f.id} style={css({ '--accent': signalOf(f.id).accent })}>
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
                  <svg className={styles.spark} viewBox="0 0 96 24" aria-hidden="true">
                    <path d={SPARKS.get(f.id)} />
                  </svg>
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
