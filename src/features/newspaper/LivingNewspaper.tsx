'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ArrowDown, ArrowUp, ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '@/features/home/sections/active/data';
import { buildArticles } from './articles';
import { newspaperFontVariables } from './fonts';
import { startLivePage } from './liveEngine';
import styles from './newspaper.module.css';

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const display = (href: string) => href.replace(/^https?:\/\//, '').replace(/\.git$/, '').replace(/\/$/, '');

/** True when this element can still scroll in the direction of the wheel, so the wheel should scroll it. */
function canScroll(el: HTMLElement, dy: number) {
  if (el.scrollHeight <= el.clientHeight + 1) return false;
  return dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0;
}

/**
 * The Daily Sagittariuz: one project to a page. On a wide screen each page is a live broadsheet: the story is laid out
 * around a photograph you can brush aside or drag, and the letters react to the cursor. Scrolling glides to the next
 * page. On phones, tablets, with reduced motion, or without JavaScript, the same stories are a plain printed page.
 */
export default function LivingNewspaper() {
  const articles = useMemo(() => buildArticles(PROJECTS), []);
  const count = articles.length;
  const rootRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLElement | null)[]>([]);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const photoRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const goRef = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0);

  const go = useCallback((index: number) => goRef.current(index), []);

  useEffect(() => {
    const root = rootRef.current;
    const scroller = scrollerRef.current;
    if (!root || !scroller) return;

    const wide = window.matchMedia('(min-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let teardown: (() => void) | null = null;

    const startLive = () => {
      root.dataset.mode = 'live';
      const pages = pageRefs.current;
      const stops: (null | (() => void))[] = articles.map(() => null);

      // A page's engine starts the first time the page is on screen, so its words fly in as you arrive.
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const i = Number((entry.target as HTMLElement).dataset.page);
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !stops[i]) {
              const stage = stageRefs.current[i];
              const canvas = canvasRefs.current[i];
              const photo = photoRefs.current[i];
              if (stage && canvas && photo) stops[i] = startLivePage({ stage, canvas, photo, article: articles[i] });
            }
            if (entry.intersectionRatio >= 0.6) setActive(i);
          }
        },
        { root: scroller, threshold: [0.35, 0.6, 0.9] },
      );
      pages.forEach((p) => p && io.observe(p));

      // --- Page turning: one gesture, one page, with an eased glide. ---
      let animating = false;
      let armed = true;
      let lastWheel = 0;
      let tween: gsap.core.Tween | null = null;
      const proxy = { v: 0 };

      const nearest = () => {
        let best = 0;
        let dist = Infinity;
        pages.forEach((p, i) => {
          if (!p) return;
          const d = Math.abs(p.offsetTop - scroller.scrollTop);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        return best;
      };
      // Pages are exactly one screen tall; if the window is too short for that, scrolling stays native.
      const hijack = () => pages.every((p) => p && p.offsetHeight <= scroller.clientHeight + 2);

      const goTo = (target: number) => {
        const index = clamp(target, 0, count - 1);
        const to = pages[index]?.offsetTop ?? 0;
        tween?.kill();
        animating = true;
        scroller.style.scrollSnapType = 'none'; // snapping would fight the animation
        proxy.v = scroller.scrollTop;
        tween = gsap.to(proxy, {
          v: to,
          duration: Math.min(1.05, 0.55 + Math.abs(to - scroller.scrollTop) / scroller.clientHeight * 0.18),
          ease: 'power3.inOut',
          onUpdate: () => {
            scroller.scrollTop = proxy.v;
          },
          onComplete: () => {
            animating = false;
            scroller.style.scrollSnapType = '';
            setActive(index);
          },
        });
      };
      goRef.current = goTo;

      const onWheel = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey || !hijack()) return;
        const inner = (e.target as HTMLElement).closest<HTMLElement>('[data-scrollable]');
        if (inner && canScroll(inner, e.deltaY)) return; // let a scrollable box scroll first
        e.preventDefault();
        const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * scroller.clientHeight : e.deltaY;
        const gap = e.timeStamp - lastWheel;
        lastWheel = e.timeStamp;
        // A new gesture starts after a short pause. Trackpad momentum (a long run of tiny events) cannot turn a second page.
        if (gap > 110 && !animating) armed = true;
        if (!armed || animating || Math.abs(dy) < 4) return;
        armed = false;
        goTo(nearest() + (dy > 0 ? 1 : -1));
      };

      const onKey = (e: KeyboardEvent) => {
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || !hijack()) return;
        if (document.querySelector('dialog[open]')) return;
        const target = e.target as HTMLElement;
        if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
        let next: number | null = null;
        const here = nearest();
        if (e.key === 'ArrowDown' || e.key === 'PageDown') next = here + 1;
        else if (e.key === 'ArrowUp' || e.key === 'PageUp') next = here - 1;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = count - 1;
        else if (e.key === ' ' && !target.closest('button, a')) next = here + (e.shiftKey ? -1 : 1);
        if (next === null) return;
        e.preventDefault();
        if (!animating) goTo(next);
      };

      scroller.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('keydown', onKey);

      return () => {
        scroller.removeEventListener('wheel', onWheel);
        window.removeEventListener('keydown', onKey);
        tween?.kill();
        io.disconnect();
        stops.forEach((stop) => stop?.());
        scroller.style.scrollSnapType = '';
        goRef.current = () => {};
      };
    };

    const evaluate = () => {
      const live = wide.matches && !reduced.matches;
      if (live && !teardown) {
        teardown = startLive();
      } else if (!live) {
        teardown?.();
        teardown = null;
        root.dataset.mode = 'static';
      }
    };

    evaluate();
    wide.addEventListener('change', evaluate);
    reduced.addEventListener('change', evaluate);
    return () => {
      wide.removeEventListener('change', evaluate);
      reduced.removeEventListener('change', evaluate);
      teardown?.();
    };
  }, [articles, count]);

  return (
    <section
      ref={rootRef}
      data-paper-root=""
      data-mode="pending"
      className={`${newspaperFontVariables} ${styles.root} ${styles.sheet}`}
      aria-labelledby="paper-title"
    >
      <noscript>
        <style>{`[data-paper-root][data-mode='pending'] [data-paper-flow],[data-paper-root][data-mode='pending'] [data-paper-static]{visibility:visible!important}`}</style>
      </noscript>

      {/* Static masthead: shown with the plain printed page. */}
      <header data-paper-static="" className={styles.staticHead}>
        <div className={styles.mastRow}>
          <span>Vol. I &middot; No. 1</span>
          <span>Edition 2026</span>
          <span>Price: one curious glance</span>
        </div>
        <h1 id="paper-title" className={styles.title}>
          The Daily Sagittariuz
        </h1>
        <p className={styles.motto}>All the news that&rsquo;s fit to ship, and a few stories that move.</p>
        <div className={styles.rule} />
      </header>

      {/* Live paper: one full-screen page per project. */}
      <div ref={scrollerRef} className={styles.scroller}>
        {articles.map((article, i) => (
          <section
            key={article.id}
            ref={(el) => {
              pageRefs.current[i] = el;
            }}
            data-page={i}
            className={`${styles.page} ${styles.sheet}`}
            aria-label={`Page ${i + 1} of ${count}: ${article.headline}`}
          >
            <header className={styles.pageHead}>
              <div className={styles.mastRow}>
                <span>Vol. I &middot; No. {i + 1}</span>
                <span>
                  Page {i + 1} of {count}
                </span>
                <span>Price: one curious glance</span>
              </div>
              <p className={styles.pageTitle}>The Daily Sagittariuz</p>
              <div className={styles.rule} />
            </header>

            <div className={styles.pageBody}>
              <div
                ref={(el) => {
                  stageRefs.current[i] = el;
                }}
                className={styles.stage}
              >
                <canvas
                  ref={(el) => {
                    canvasRefs.current[i] = el;
                  }}
                  className={styles.canvas}
                  aria-hidden="true"
                />
                <a
                  ref={(el) => {
                    photoRefs.current[i] = el;
                  }}
                  href={article.links[0]?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  aria-hidden="true"
                  tabIndex={-1}
                  className={styles.photo}
                >
                  <span className={styles.shot}>
                    <Image src={article.photo.src} alt="" width={article.photo.width} height={article.photo.height} sizes="360px" draggable={false} style={{ objectPosition: article.photo.position }} />
                  </span>
                  <span className={styles.caption}>
                    Fig. {i + 1} &mdash; {article.caption}
                  </span>
                </a>
              </div>

              <aside className={styles.side} data-scrollable="" aria-label={`More about ${article.headline}`}>
                <div className={styles.box}>
                  <h3 className={styles.boxTitle}>At a glance</h3>
                  <dl className={styles.facts}>
                    {article.facts.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className={styles.box}>
                  <h3 className={styles.boxTitle}>Read it at the source</h3>
                  {article.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                      <span>
                        {link.label}
                        <small style={{ wordBreak: 'break-all' }}>{display(link.href)}</small>
                      </span>
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ))}
                </div>

                <div className={styles.box}>
                  <h3 className={styles.boxTitle}>Filed under</h3>
                  <ul className={styles.tags}>
                    {article.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.box}>
                  <h3 className={styles.boxTitle}>Inside this edition</h3>
                  <ol className={styles.index} data-scrollable="">
                    {articles.map((other, k) => (
                      <li key={other.id}>
                        <button type="button" className={styles.indexBtn} aria-current={k === i ? 'page' : undefined} onClick={() => go(k)}>
                          <span>{String(k + 1).padStart(2, '0')}</span>
                          <span>{PROJECTS[k]?.title ?? other.headline}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              </aside>
            </div>

            <div className={styles.foot}>
              <p className={styles.hint}>Brush the page &middot; drag the photograph &middot; touch the headline</p>
              <button type="button" className={styles.turn} onClick={() => go(i === count - 1 ? 0 : i + 1)}>
                {i === count - 1 ? (
                  <>
                    <ArrowUp size={14} aria-hidden="true" /> Back to the front page
                  </>
                ) : (
                  <>
                    Turn the page <ArrowDown size={14} aria-hidden="true" /> Next: {articles[i + 1].kicker}
                  </>
                )}
              </button>
              <p className={styles.pageNo}>
                {String(i + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </p>
            </div>
          </section>
        ))}
      </div>

      <nav className={styles.dots} aria-label="Pages of the newspaper">
        {articles.map((article, i) => (
          <button key={article.id} type="button" className={styles.dot} aria-label={`Page ${i + 1}: ${PROJECTS[i]?.title ?? article.headline}`} aria-current={active === i ? 'page' : undefined} onClick={() => go(i)} />
        ))}
      </nav>

      {/* The same stories as plain text: shown with the printed page, and kept for screen readers and search. */}
      <div data-paper-flow="" className={styles.flow}>
        {articles.map((article, i) => (
          <article key={article.id} className={styles.story}>
            <p className={styles.kicker}>{article.kicker}</p>
            <h2 className={styles.headline}>
              {article.links[0] ? (
                <a href={article.links[0].href} target="_blank" rel="noopener noreferrer">
                  {article.headline}
                </a>
              ) : (
                article.headline
              )}
            </h2>
            <p className={styles.byline}>{article.byline}</p>
            <figure className={styles.figure}>
              <a href={article.links[0]?.href} target="_blank" rel="noopener noreferrer" className={styles.photo} tabIndex={-1}>
                <span className={styles.shot}>
                  <Image src={article.photo.src} alt={article.photo.alt} width={article.photo.width} height={article.photo.height} sizes="(min-width: 1024px) 30vw, 90vw" style={{ objectPosition: article.photo.position }} />
                </span>
                <span className={styles.caption}>
                  Fig. {i + 1} &mdash; {article.caption}
                </span>
              </a>
            </figure>
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <dl className={`${styles.facts} ${styles.staticFacts}`}>
              {article.facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.staticLinks}>
              {article.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                  <span>
                    {link.label}
                    <small style={{ wordBreak: 'break-all' }}>{display(link.href)}</small>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
