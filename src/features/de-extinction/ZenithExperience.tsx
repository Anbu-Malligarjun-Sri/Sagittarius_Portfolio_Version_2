'use client';

import { useEffect, useRef, useState } from 'react';
import { remoteFont } from '@/features/fontDescriptor';
import ZenithBoneScene from './ZenithBoneScene';
import styles from './ZenithExperience.module.css';

const cinzel = remoteFont({
  family: 'Cinzel',
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const rajdhani = remoteFont({
  family: 'Rajdhani',
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '500', '700'],
});

const spaceMono = remoteFont({
  family: 'Space Mono',
  variable: '--font-tech',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const BOOT_LOGS = [
  'INITIALIZING WEBGL CONTEXT...',
  'COMPILING SHADERS...',
  'CALIBRATING ANATOMY...',
  'SPAWNING SWARM...',
  'SYSTEM READY.',
];

const ZenithExperience = () => {
  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const shockwaveRef = useRef(0);

  const cursorCoreRef = useRef<HTMLDivElement>(null);
  const cursorPerimeterRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const bootFillRef = useRef<HTMLDivElement>(null);
  const bootLogRef = useRef<HTMLDivElement>(null);
  const uiLayerRef = useRef<HTMLDivElement>(null);
  const hudProgressRef = useRef<HTMLDivElement>(null);
  const hudZRef = useRef<HTMLSpanElement>(null);
  const hudVelRef = useRef<HTMLSpanElement>(null);
  const hudPxRef = useRef<HTMLSpanElement>(null);
  const hudPyRef = useRef<HTMLSpanElement>(null);
  const hudTensionRef = useRef<HTMLSpanElement>(null);

  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    document.body.classList.add('leviathan-body');
    return () => {
      document.body.classList.remove('leviathan-body');
    };
  }, []);

  useEffect(() => {
    const prevBodyOverflowY = document.body.style.overflowY;
    const prevHtmlOverflowY = document.documentElement.style.overflowY;
    const prevBodyHeight = document.body.style.height;
    const prevHtmlHeight = document.documentElement.style.height;

    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';

    return () => {
      document.body.style.overflowY = prevBodyOverflowY;
      document.documentElement.style.overflowY = prevHtmlOverflowY;
      document.body.style.height = prevBodyHeight;
      document.documentElement.style.height = prevHtmlHeight;
    };
  }, []);

  useEffect(() => {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorCoreRef.current) {
        cursorCoreRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    };

    const animate = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (cursorPerimeterRef.current) {
        cursorPerimeterRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      if (hudPxRef.current) hudPxRef.current.textContent = rx.toFixed(1);
      if (hudPyRef.current) hudPyRef.current.textContent = ry.toFixed(1);
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  useEffect(() => {
    let idx = 0;
    let pct = 0;
    const interval = window.setInterval(() => {
      pct = Math.min(100, pct + Math.random() * 14 + 2);
      if (bootFillRef.current) {
        bootFillRef.current.style.width = `${pct}%`;
      }
      if (bootLogRef.current) {
        bootLogRef.current.textContent = BOOT_LOGS[idx % BOOT_LOGS.length];
      }
      idx += 1;

      if (pct >= 100) {
        window.clearInterval(interval);
        setTimeout(() => {
          setBootComplete(true);
          if (uiLayerRef.current) {
            uiLayerRef.current.classList.add(styles.uiVisible);
          }
        }, 600);
      }
    }, 120);

    return () => window.clearInterval(interval);
  }, [styles.uiVisible]);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollTargetRef.current = window.scrollY / maxScroll;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    let raf = 0;
    const animate = () => {
      const prev = scrollCurrentRef.current;
      scrollCurrentRef.current += (scrollTargetRef.current - scrollCurrentRef.current) * 0.07;
      scrollVelocityRef.current = scrollCurrentRef.current - prev;
      scrollProgressRef.current = scrollCurrentRef.current;

      shockwaveRef.current += scrollVelocityRef.current * 0.1;
      shockwaveRef.current *= 0.92;

      if (hudProgressRef.current) {
        hudProgressRef.current.style.transform = `scaleY(${scrollCurrentRef.current})`;
      }
      if (hudZRef.current) {
        hudZRef.current.textContent = (scrollCurrentRef.current * 5000).toFixed(1);
      }
      if (hudVelRef.current) {
        hudVelRef.current.textContent = scrollVelocityRef.current.toFixed(3);
      }
      if (hudTensionRef.current) {
        hudTensionRef.current.textContent = shockwaveRef.current.toFixed(2);
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={`${styles.root} ${cinzel.variable} ${rajdhani.variable} ${spaceMono.variable}`}
      style={
        {
          '--color-primary': '#00e5ff',
          '--color-secondary': '#8c00ff',
          '--color-accent': '#ff0055',
          '--color-bg': '#010102',
          '--color-text': '#ffffff',
          '--color-text-dim': 'rgba(255, 255, 255, 0.4)',
          '--hud-padding': '3vw',
        } as React.CSSProperties
      }
    >
      <div ref={cursorCoreRef} className={styles.cursorCore} />
      <div ref={cursorPerimeterRef} className={styles.cursorPerimeter} />

      <div className={styles.noise} />
      <div className={styles.vignette} />
      <div className={styles.scanline} />

      <div className={styles.webgl}>
        <ZenithBoneScene scrollProgressRef={scrollProgressRef} scrollVelocityRef={scrollVelocityRef} />
      </div>

      <div ref={bootRef} className={`${styles.bootSequence} ${bootComplete ? styles.bootHidden : ''}`}>
        <div className={styles.bootTitle}>OSTEOGENESIS</div>
        <div className={styles.bootBar}>
          <div ref={bootFillRef} className={styles.bootFill} />
        </div>
        <div ref={bootLogRef} className={styles.bootLog}>INITIALIZING WEBGL CONTEXT...</div>
      </div>

      <div ref={uiLayerRef} className={styles.uiLayer}>
        <div className={styles.hudTop}>
          <div className={styles.hudLeft}>
            <div className={styles.hudTitle}>LEVIATHAN</div>
            <div className={styles.hudSubtitle}>ANATOMICAL PROCEDURAL ENGINE v3.0</div>
            <div style={{ color: 'var(--color-text-dim)', marginTop: '10px' }}>GENERATIVE BIOMECHANICS</div>
          </div>
          <div className={styles.hudRight}>
            <div className={styles.hudDataRow}>
              <span className={styles.statusDot} />
              <span>NEURAL LINK ESTABLISHED</span>
            </div>
            <div className={styles.hudDataRow}>
              <span style={{ color: 'var(--color-primary)' }}>WEBGL 2.0 // GLSL</span>
            </div>
            <div className={styles.hudDataRow}>
              <span style={{ color: 'var(--color-text-dim)' }}>
                TENSION: <span ref={hudTensionRef}>0.00</span> N/m
              </span>
            </div>
          </div>
        </div>

        <div className={styles.hudBottom}>
          <div className={styles.diagBox}>
            <span className={styles.diagValue}>180</span>
            <span className={styles.diagLabel}>VERTEBRAE RENDERED</span>
            <span className={styles.diagValue} style={{ marginTop: '10px' }}>100,000</span>
            <span className={styles.diagLabel}>SWARM ENTITIES</span>
          </div>

          <div className={styles.scrollDirector}>
            <div className={styles.scrollText}>KINETIC DESCENT</div>
            <div className={styles.scrollTrack}>
              <div ref={hudProgressRef} className={styles.scrollProgress} />
            </div>
          </div>

          <div className={styles.engineStats}>
            <div className={styles.statLine}>
              <span>DEPTH (Z)</span>
              <span className={styles.statHighlight} ref={hudZRef}>0000</span>
            </div>
            <div className={styles.statLine}>
              <span>VELOCITY</span>
              <span className={styles.statHighlight} ref={hudVelRef}>0.00</span>
            </div>
            <div className={styles.statLine}>
              <span>PARALLAX X</span>
              <span className={styles.statHighlight} ref={hudPxRef}>0.00</span>
            </div>
            <div className={styles.statLine}>
              <span>PARALLAX Y</span>
              <span className={styles.statHighlight} ref={hudPyRef}>0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollProxy} />
    </div>
  );
};

export default ZenithExperience;
