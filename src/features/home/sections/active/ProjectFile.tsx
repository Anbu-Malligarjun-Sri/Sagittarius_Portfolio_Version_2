'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectCard, ProjectTheme } from './types';
import styles from './projects.module.css';

const ACCENT: Record<ProjectTheme, string> = { ocean: '#2dd4bf', terminal: '#f59e0b', default: '#e8c547' };

// Fixed positions, so server and client render identically: [left %, size px, duration s, delay s]
const BUBBLES: [number, number, number, number][] = [
  [6, 6, 9, 0], [14, 10, 12, 2], [22, 5, 8, 4], [31, 8, 11, 1], [40, 12, 14, 3], [49, 5, 9, 6], [57, 9, 12, 0.5],
  [65, 6, 10, 2.5], [73, 11, 13, 5], [81, 5, 8, 1.5], [88, 8, 11, 3.5], [94, 6, 9, 7], [36, 4, 7, 5.5], [70, 4, 8, 8],
];

// The Personality Matrix shown in the TARS interface itself.
const PERSONALITY = [
  { label: 'Humor', value: 75, color: '#f59e0b' },
  { label: 'Honesty', value: 90, color: '#38a3e8' },
  { label: 'Discretion', value: 50, color: '#22c55e' },
];

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;

/** One project, shown as a case file: a themed stage with the interface, and the details beside it. */
export default function ProjectFile({ project, index, total, flip }: { project: ProjectCard; index: number; total: number; flip: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const theme = project.theme ?? 'default';
  const accent = ACCENT[theme];

  // Reveal when scrolled into view. Content stays visible without JS: it is only hidden once armed here.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.classList.add(styles.armed);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.in);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.classList.remove(styles.armed, styles.in);
    };
  }, []);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage || event.pointerType === 'touch') return;
    const r = stage.getBoundingClientRect();
    stage.style.setProperty('--ry', `${(((event.clientX - r.left) / r.width - 0.5) * 7).toFixed(2)}deg`);
    stage.style.setProperty('--rx', `${((0.5 - (event.clientY - r.top) / r.height) * 5).toFixed(2)}deg`);
  };
  const onLeave = () => {
    stageRef.current?.style.removeProperty('--rx');
    stageRef.current?.style.removeProperty('--ry');
  };

  const chromeLabel = theme === 'terminal' ? '>_ TARS interface v2.0' : theme === 'ocean' ? 'species-id / dna barcoding' : project.title;
  const num = String(index + 1).padStart(2, '0');

  return (
    <article
      ref={rootRef}
      id={`project-${project.id}`}
      aria-labelledby={`project-${project.id}-title`}
      className={`${styles.file} grid scroll-mt-28 items-center gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:gap-14`}
      style={css({ '--accent': accent })}
    >
      {/* ── Stage ── */}
      <div
        ref={stageRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`${styles.stage} ${styles[theme === 'default' ? 'plain' : theme]} p-4 sm:p-7 ${theme === 'ocean' ? 'md:pl-16' : ''} ${flip ? 'lg:order-2' : ''}`}
      >
        {theme === 'ocean' ? (
          <>
            <div className={styles.sonar} aria-hidden="true" />
            <div className={styles.sonar} style={{ animationDelay: '2s' }} aria-hidden="true" />
            <div className={styles.sonar} style={{ animationDelay: '4s' }} aria-hidden="true" />
            {BUBBLES.map(([left, size, duration, delay]) => (
              <span key={`${left}-${size}`} className={styles.bubble} style={{ left: `${left}%`, width: size, height: size, animationDuration: `${duration}s`, animationDelay: `${delay}s` }} aria-hidden="true" />
            ))}
            <div className={`${styles.gauge} hidden md:block`} aria-hidden="true">
              <span className={styles.gaugeMark} />
              <span className="absolute left-3 top-0">0m</span>
              <span className="absolute left-3 top-[33%]">1km</span>
              <span className="absolute left-3 top-[66%]">2km</span>
              <span className="absolute bottom-0 left-3">4km</span>
            </div>
          </>
        ) : null}

        <div className={`${styles.device} ${theme === 'terminal' ? styles.crt : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          <div className={styles.shot}>
            <div className={styles.chrome}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className="ml-2 truncate">{chromeLabel}</span>
            </div>
            <div className="relative">
              <Image
                src={project.image.src}
                alt={project.image.alt}
                width={project.image.width}
                height={project.image.height}
                sizes="(min-width: 1024px) 760px, 92vw"
                className="block h-auto w-full"
              />
              {theme === 'terminal' ? (
                <>
                  <div className={styles.scanlines} aria-hidden="true" />
                  <div className={styles.scanBeam} aria-hidden="true" />
                </>
              ) : null}
            </div>
          </div>

          {theme === 'ocean' ? (
            <>
              <span className={`${styles.chip} -right-2 top-14 hidden sm:block`} aria-hidden="true">DNA barcode → species</span>
              <span className={`${styles.chip} -left-3 bottom-10 hidden sm:block`} style={{ animationDelay: '1.6s' }} aria-hidden="true">Confidence score</span>
            </>
          ) : null}

          {theme === 'terminal' ? (
            <div className={`${styles.matrix} hidden sm:block`} aria-hidden="true">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#f59e0b]">Personality matrix</p>
              {PERSONALITY.map((trait, i) => (
                <div key={trait.label} className="mb-2 last:mb-0">
                  <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-[0.18em]" style={{ color: trait.color }}>
                    <span>{trait.label}</span>
                    <span>{trait.value}%</span>
                  </div>
                  <div className={styles.bar}>
                    <span className={styles.barFill} style={css({ '--v': trait.value, '--c': trait.color, '--i': i })} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {theme === 'terminal' ? (
          <p className="mt-5 font-mono text-[11px] tracking-[0.04em] text-[#f59e0b]/90 sm:mt-6 sm:pl-1">
            <span className={styles.typed}>&gt; Connection established. All systems nominal.</span>
          </p>
        ) : null}
      </div>

      {/* ── Details ── */}
      <div className={flip ? 'lg:order-1' : ''}>
        <p className={`${styles.reveal} font-mono text-[11px] uppercase tracking-[0.35em]`} style={css({ '--i': 0, color: accent })}>
          File {num} <span className="text-white/35">/ {String(total).padStart(2, '0')}</span> · {project.category}
        </p>
        <h3
          id={`project-${project.id}-title`}
          className={`${styles.reveal} mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#f5f0e8]`}
          style={css({ '--i': 1 })}
        >
          {project.title}
        </h3>
        <p className={`${styles.reveal} mt-2 font-mono text-[12px] uppercase tracking-[0.16em]`} style={css({ '--i': 2, color: accent })}>
          {project.subtitle}
        </p>
        <p className={`${styles.reveal} mt-5 max-w-[46ch] text-[1.02rem] leading-8 text-[#f5f0e8]/72`} style={css({ '--i': 3 })}>
          {project.summary}
        </p>

        <dl className={`${styles.reveal} mt-7 max-w-[46ch] border-t border-white/10`} style={css({ '--i': 4 })}>
          {project.readout.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{label}</dt>
              <dd className="text-right text-[13.5px] text-[#f5f0e8]/85">{value}</dd>
            </div>
          ))}
        </dl>

        <ul className={`${styles.reveal} mt-6 flex flex-wrap gap-2`} style={css({ '--i': 5 })}>
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em]" style={{ borderColor: `${accent}55`, color: accent }}>
              {tag}
            </li>
          ))}
        </ul>

        {project.links?.length ? (
          <div className={`${styles.reveal} mt-7 flex flex-wrap gap-3`} style={css({ '--i': 6 })}>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-[#f5f0e8] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {link.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
