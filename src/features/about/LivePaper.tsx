'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { LETTER } from './copy';
import { createPaperScene } from './paperScene';
import type { PaperScene } from './paperScene';
import { resolveFonts } from './paperTexture';
import styles from './about.module.css';

/*
 * The letter, on a sheet of paper you can handle. In a browser with WebGL the sheet is a live 3D object (see
 * paperScene.ts). Without WebGL, or for people who ask for reduced motion, it is a still printed letter. Either way
 * the real text is in the page for screen readers and search engines.
 */

type Mode = 'loading' | 'live' | 'static';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
// Written defensively: a missing matchMedia (very old browsers, test environments) must never take the page down.
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia?.(REDUCED_QUERY);
  query?.addEventListener?.('change', onChange);
  return () => query?.removeEventListener?.('change', onChange);
};
const reducedNow = () => window.matchMedia?.(REDUCED_QUERY).matches ?? false;

/** The letter as ordinary text. */
function LetterText() {
  return (
    <>
      <h3>{LETTER.headline}</h3>
      {LETTER.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p>
        {LETTER.promisesLead} {LETTER.promises.join(' ')}
      </p>
      <p>{LETTER.closing}</p>
      <p>
        {LETTER.signature}. {LETTER.signoff}.
      </p>
    </>
  );
}

/** A printed letter, used when the paper cannot be live. */
function StaticLetter() {
  return (
    <article className={styles.printed}>
      <header>
        <span>{LETTER.letterhead[0]}</span>
        <span>{LETTER.letterhead[1]}</span>
      </header>
      <h3>{LETTER.headline}</h3>
      {LETTER.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p className={styles.promiseLead}>{LETTER.promisesLead}</p>
      <ul>
        {LETTER.promises.map((promise) => (
          <li key={promise}>{promise}</li>
        ))}
      </ul>
      <p className={styles.closing}>{LETTER.closing}</p>
      <p className={styles.signature}>{LETTER.signature}</p>
      <p className={styles.signoff}>{LETTER.signoff}</p>
    </article>
  );
}

export default function LivePaper() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<PaperScene | null>(null);
  const [mode, setMode] = useState<Mode>('loading');
  const [width, setWidth] = useState(0);
  const reduced = useSyncExternalStore(subscribeReduced, reducedNow, () => false);
  const shown: Mode = reduced ? 'static' : mode;

  // Watch the container's width. The sheet is rebuilt (longer or shorter) when the width changes a lot, so the type
  // stays a readable size; for smaller changes the canvas is simply resized.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0;
      if (next <= 0) return;
      setWidth((current) => (!current || Math.abs(next - current) > Math.max(60, current * 0.14) ? Math.round(next) : current));
      sceneRef.current?.resize();
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  // Stop drawing while the paper is off screen.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new IntersectionObserver(([entry]) => sceneRef.current?.setVisible(entry.isIntersecting), { rootMargin: '150px' });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || reduced || !width) return;

    let disposed = false;
    let scene: PaperScene | null = null;
    let frame = 0;

    (async () => {
      let THREE: typeof import('three');
      try {
        THREE = await import('three');
      } catch {
        if (!disposed) setMode('static');
        return;
      }
      const fonts = await resolveFonts(wrap);
      if (disposed) return;
      try {
        scene = createPaperScene(THREE, canvas, {
          fonts,
          containerWidth: width,
          onActive: (active) => wrapRef.current?.setAttribute('data-awake', String(active)),
        });
      } catch {
        // no WebGL here: the printed letter is shown instead
        if (!disposed) setMode('static');
        return;
      }
      sceneRef.current = scene;
      wrap.style.aspectRatio = String(scene.canvasAspect);
      scene.resize();
      frame = requestAnimationFrame(() => {
        if (!disposed) setMode('live');
      });
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      if (sceneRef.current === scene) sceneRef.current = null;
      scene?.dispose();
    };
  }, [width, reduced]);

  return (
    <div ref={wrapRef} className={`${styles.stage} magnetic-target`} data-cursor-scale="2.2" data-mode={shown} data-awake="false">
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      {shown === 'static' ? (
        <StaticLetter />
      ) : (
        <div className="sr-only">
          <LetterText />
        </div>
      )}
    </div>
  );
}
