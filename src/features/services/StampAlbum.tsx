'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import StampDialog from './StampDialog';
import { stampFontVariables } from './fonts';
import StampFace from './StampFace';
import { STAMPS } from './stamps';
import styles from './stamps.module.css';

const STORAGE_KEY = 'sagittarius-stamp-album';

// Reservations are a per-visitor keepsake, so they live in this browser only. A tiny external store keeps
// server and first client render identical (empty), then reads localStorage after hydration.
const listeners = new Set<() => void>();
let memory = '';

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function readRaw(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? memory;
  } catch {
    return memory;
  }
}

function writeRaw(raw: string) {
  memory = raw;
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    /* private window: the stamp still shows for this visit */
  }
  listeners.forEach((listener) => listener());
}

function parse(raw: string): Record<string, string> {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export default function StampAlbum() {
  const albumRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const raw = useSyncExternalStore(subscribe, readRaw, () => '');
  const reserved = useMemo(() => parse(raw), [raw]);

  // Stamps fly in once, the first time the album scrolls into view.
  useEffect(() => {
    const album = albumRef.current;
    if (!album) return;
    album.dataset.armed = 'true';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        album.dataset.in = 'true';
        observer.disconnect();
      },
      { threshold: 0.12 },
    );
    observer.observe(album);
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback((id: string) => {
    const next = parse(readRaw());
    if (next[id]) delete next[id];
    else next[id] = new Date().toISOString();
    writeRaw(JSON.stringify(next));
  }, []);

  const step = useCallback((delta: number) => {
    setOpen((current) => (current === null ? current : (current + delta + STAMPS.length) % STAMPS.length));
  }, []);

  // A gentle tilt that follows the mouse, with a sheen of light across the paper.
  const tilt = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse') return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    el.style.setProperty('--ry', `${((px - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - py) * 12).toFixed(2)}deg`);
    el.style.setProperty('--sx', (px * 300 - 40).toFixed(1));
  };
  const untilt = (event: PointerEvent<HTMLButtonElement>) => {
    const el = event.currentTarget;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };

  const count = STAMPS.filter((stamp) => reserved[stamp.id]).length;

  return (
    <div ref={albumRef} className={`${styles.album} ${stampFontVariables}`}>
      <div className={styles.albumHead}>
        <div>
          <p className={styles.albumTitle}>The Sagittarius album</p>
          <p className={styles.albumNote}>
            One stamp for every kind of work we do. Open one to see what is inside. Finish a project with us and the matching stamp is yours, postmarked with
            the delivery date.
          </p>
        </div>
        <div className={styles.count} aria-live="polite">
          {count === STAMPS.length ? 'Full set ✦' : `${count} / ${STAMPS.length} reserved`}
          <div className={styles.pips} aria-hidden="true">
            {STAMPS.map((stamp) => (
              <span key={stamp.id} className={styles.pip} data-on={reserved[stamp.id] ? 'true' : 'false'} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {STAMPS.map((stamp, index) => (
          <div key={stamp.id} className={styles.slot} style={{ '--glow': stamp.glow } as CSSProperties}>
            <div className={styles.drop} style={{ '--i': index } as CSSProperties}>
              <button
                type="button"
                className={styles.stampBtn}
                aria-label={`Open the ${stamp.name} stamp`}
                data-cursor-scale="1.8"
                style={{ '--rest': `${stamp.rest}deg` } as CSSProperties}
                onClick={() => setOpen(index)}
                onPointerMove={tilt}
                onPointerLeave={untilt}
              >
                <StampFace stamp={stamp} reservedAt={reserved[stamp.id]} />
              </button>
            </div>
            <div className={styles.caption}>
              <span className={styles.captionName}>{stamp.name}</span>
              <span className={styles.captionMeta} data-on={reserved[stamp.id] ? 'true' : 'false'}>
                {reserved[stamp.id] ? 'Reserved ✓' : `Nº ${stamp.no} · ${stamp.timeline}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {open !== null && <StampDialog stamps={STAMPS} index={open} reserved={reserved} onClose={() => setOpen(null)} onStep={step} onToggle={toggle} />}
    </div>
  );
}
