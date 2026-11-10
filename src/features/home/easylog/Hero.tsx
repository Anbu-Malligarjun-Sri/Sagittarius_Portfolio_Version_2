"use client";

import { useEffect, useRef, useState } from 'react';
import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
import { gsap } from 'gsap';
import LogCanvas, { type IntroMotion } from './LogCanvas';
import Cursor from './Cursor';
import { loadImages, LOG_URLS, type LogImages } from './loadImages';
import styles from './hero.module.css';
import tokens from './tokens.module.css';

const sans = Instrument_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--easy-sans', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: 'italic', variable: '--easy-serif', display: 'swap' });
const INITIAL_ZOOM = 2.6, INITIAL_PIXEL_LOG = 6, LOAD_TIMEOUT = 15000;
const ZOOM_DURATION = .9, PIXEL_DURATION = 1, COUNT_DURATION = .8, CHARACTER_STAGGER = .035;

export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const motion = useRef<IntroMotion>({ zoom: INITIAL_ZOOM, pixel: INITIAL_PIXEL_LOG, active: true });
  const [images, setImages] = useState<LogImages | null>(null);

  useEffect(() => {
    const root = hero.current; if (!root) return;
    let cancelled = false, loaded: LogImages | null = null;
    const controller = new AbortController();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    motion.current = { zoom: reduce ? 1 : INITIAL_ZOOM, pixel: reduce ? 0 : INITIAL_PIXEL_LOG, active: true };
    const count = { value: 0 };
    let follow: ReturnType<typeof gsap.quickTo>;
    const context = gsap.context(() => {
      follow = gsap.quickTo(count, 'value', { duration: .4, ease: 'power1.out', onUpdate: () => {
        if (counter.current) counter.current.textContent = String(Math.round(count.value * 100)).padStart(2, '0');
      } });
    }, root);
    const timeout = window.setTimeout(() => controller.abort(), LOAD_TIMEOUT);
    let fontTimeout = 0;
    const fontReady = Promise.race([
      Promise.all([
        document.fonts.load(`italic 400 16px ${serif.style.fontFamily.split(',')[0]}`),
        document.fonts.load(`400 16px ${sans.style.fontFamily.split(',')[0]}`),
        document.fonts.load(`500 16px ${sans.style.fontFamily.split(',')[0]}`),
      ]),
      new Promise<void>(resolve => { fontTimeout = window.setTimeout(resolve, LOAD_TIMEOUT); }),
    ]);
    const artwork = loadImages(controller.signal, value => { if (!cancelled) follow(value * .9); })
      .then(value => { loaded = value; if (cancelled) { value.bare.close(); value.moss.close(); return null; } return value; })
      .catch(error => { if (!cancelled) console.error('Easylog artwork unavailable; showing the hero without the log.', error); return null; });
    Promise.all([artwork, fontReady]).then(([value]) => {
      clearTimeout(timeout); clearTimeout(fontTimeout);
      if (cancelled) return;
      setImages(value);
      context.add(() => {
        follow.tween.kill();
        const timeline = gsap.timeline();
        if (reduce) {
          gsap.set('[data-counter]', { autoAlpha: 0 });
          timeline.to('[data-reveal], [data-character]', { opacity: 1, duration: .4, ease: 'power1.out', onComplete: () => { motion.current.active = false; } });
          return;
        }
        timeline.to(count, { value: 1, duration: COUNT_DURATION, ease: 'power1.out', onUpdate: () => { if (counter.current) counter.current.textContent = String(Math.round(count.value * 100)).padStart(2, '0'); } }, 0);
        timeline.to(motion.current, { zoom: 1, duration: ZOOM_DURATION, ease: 'expo.out' }, 0);
        timeline.to(motion.current, { pixel: 0, duration: PIXEL_DURATION, ease: 'none', onComplete: () => { motion.current.active = false; } }, 0);
        timeline.to('[data-counter]', { opacity: 0, duration: .4, ease: 'power1.in' }, .85);
        const reveal = (selector: string, start: number, blur = 10, duration = .6) => {
          timeline.fromTo(selector, { opacity: 0, filter: `blur(${blur}px)` }, { opacity: 1, filter: 'blur(0px)', duration, ease: 'power2.out', clearProps: 'filter' }, start);
        };
        root.querySelectorAll('[data-line]').forEach(line => {
          timeline.fromTo(line.querySelectorAll('[data-character]'), { opacity: 0, filter: 'blur(18px)', xPercent: -30 }, { opacity: 1, filter: 'blur(0px)', xPercent: 0, duration: .8, stagger: CHARACTER_STAGGER, ease: 'power2.out', clearProps: 'filter,transform' }, 1.3);
        });
        reveal('[data-lead]', 2.1); reveal('[data-bottom]', 2.5); reveal('[data-action-copy]', 2.7); reveal('[data-cta]', 2.85);
      });
    });
    const observer = new IntersectionObserver(([entry]) => { root.dataset.navActive = String(entry.isIntersecting); }, { rootMargin: '-80px 0px 0px 0px' }); observer.observe(root);
    return () => {
      cancelled = true; controller.abort(); clearTimeout(timeout); clearTimeout(fontTimeout); observer.disconnect(); context.revert();
      loaded?.bare.close(); loaded?.moss.close();
    };
  }, []);

  const line = (text: string, className: string) => <span className={className} data-line aria-hidden="true">{Array.from(text).map((character, index) => <span key={index} data-character>{character}</span>)}</span>;

  return (
    <section ref={hero} className={`${tokens.tokens} ${sans.variable} ${serif.variable} ${styles.hero}`} data-easylog data-nav-active="true" aria-label="Less friction. More discovery" onKeyDown={event => event.stopPropagation()}>
      {LOG_URLS.map(url => <link key={url} rel="preload" as="fetch" href={url} crossOrigin="anonymous" />)}
      <LogCanvas images={images} motion={motion} hero={hero} />
      <div className={styles.topCopy}>
        <h1 className={styles.headline} aria-label="Less friction. More discovery.">{line('Less friction.', styles.serifLine)}{line('More discovery.', styles.sansLine)}</h1>
        <p className={`${styles.body} ${styles.lead}`} data-lead data-reveal>More time for the question. Less time lost between the steps. AI built around the way you work.</p>
      </div>
      <div className={styles.action}>
        <p className={styles.body} data-action-copy data-reveal>Sagittariuz builds thoughtful software and AI tools for researchers, students, and people with problems worth solving.</p>
        <a href="#projects" className={styles.cta} data-cta data-reveal>Explore our work</a>
      </div>
      <div className={styles.bottom} data-bottom data-reveal>
        <span>Human curiosity. Thoughtful technology.</span><span>Est. 2026</span>
      </div>
      <p className={styles.counter} data-counter aria-hidden="true"><span ref={counter}>00</span><span className={styles.percent}>%</span></p>
      <Cursor hero={hero} />
    </section>
  );
}
