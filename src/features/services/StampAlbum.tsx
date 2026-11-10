'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { SERVICE_BRIEFS } from './inquirySchema';
import type { CSSProperties, PointerEvent } from 'react';
import { stampFontVariables } from './fonts';
import StampFace from './StampFace';
import { STAMPS } from './stamps';
import styles from './stamps.module.css';

export default function StampAlbum() {
  const albumRef = useRef<HTMLDivElement>(null);
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

  // A gentle tilt that follows the mouse, with a sheen of light across the paper.
  const tilt = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse') return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    el.style.setProperty('--ry', `${((px - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - py) * 12).toFixed(2)}deg`);
    el.style.setProperty('--sx', (px * 300 - 40).toFixed(1));
    // where the owl's eyes should look (its eyes sit about a third of the way down the stamp)
    el.style.setProperty('--ex', Math.max(-1, Math.min(1, (px - 0.5) * 3)).toFixed(2));
    el.style.setProperty('--ey', Math.max(-1, Math.min(1, (py - 0.35) * 3)).toFixed(2));
  };
  const untilt = (event: PointerEvent<HTMLAnchorElement>) => {
    const el = event.currentTarget;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ex', '0');
    el.style.setProperty('--ey', '0');
  };


  return (
    <div ref={albumRef} className={`${styles.album} ${stampFontVariables}`}>
      <div className={styles.albumHead}>
        <div>
          <p className={styles.albumTitle}>The Sagittariuz album</p>
          <p className={styles.albumNote}>
            One stamp for every kind of work we do. Open one to explore the service and start a project inquiry. A reservation begins a conversation, not a booking.
          </p>
        </div>
        <div className={styles.count} aria-live="polite">
          Six services / Start a conversation
        </div>
      </div>

      <div className={styles.grid}>
        {STAMPS.map((stamp, index) => (
          <div key={stamp.id} className={styles.slot} style={{ '--glow': stamp.glow } as CSSProperties}>
            <div className={styles.drop} style={{ '--i': index } as CSSProperties}>
              <Link
                href={`/services/${SERVICE_BRIEFS.find(service => service.stampId === stamp.id)?.slug}`}
                className={styles.stampBtn}
                aria-label={`Open the ${stamp.name} stamp`}
                data-cursor-scale="1.8"
                style={{ '--rest': `${stamp.rest}deg` } as CSSProperties}
                onPointerMove={tilt}
                onPointerLeave={untilt}
              >
                <StampFace stamp={stamp} />
              </Link>
            </div>
            <div className={styles.caption}>
              <span className={styles.captionName}>{stamp.name}</span>
              <span className={styles.captionMeta}>
                View service & start a brief
              </span>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}
