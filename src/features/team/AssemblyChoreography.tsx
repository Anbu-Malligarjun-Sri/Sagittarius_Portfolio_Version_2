'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { FOUNDERS } from './founders';
import CursorSwarm from './CursorSwarm';
import styles from './team.module.css';

/**
 * Page assembly choreography for /team.
 *
 * Every element marked `data-assemble` starts hidden and displaced. When its *final* position
 * enters the viewport, a small crew of arrows is sent to it: they fly in from different directions
 * (curved paths), hook onto the element's leading edge, and drag it into its real layout position
 * while a selection box tracks it. Then the box fades, the element settles, and the arrows leave.
 *
 * Targets are measured from live bounding boxes (never hardcoded coordinates) and the arrows
 * re-read those boxes on every tick, so the effect stays attached to the element through scrolling.
 * Once the first scene is assembled, a few ambient arrows drift quietly behind the content.
 */

type Side = 'left' | 'right' | 'top' | 'bottom';
type Item = { el: HTMLElement; from: Side; ox: number; oy: number };
type Point = { x: number; y: number };
type Crew = { wrap: HTMLElement; rot: HTMLElement; f: number };

const ARROW_PATH = 'M2 2 L2 18 L6.5 13.5 L10 21 L13 19.6 L9.6 12.4 L16 12.4 Z';
const TIP_ROTATION = 121.1; // turns the arrow so its tip points along +x at rotation 0
const INK = '#060608';
const SELECT = '#4a90d9';

// Element enters from `from`; arrows hook the opposite (leading) edge and point into the element.
const LEAD_EDGE: Record<Side, Side> = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' };
const PULL_HEADING: Record<Side, number> = { left: 180, right: 0, top: -90, bottom: 90 };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const smooth = (v: number) => {
  const c = clamp(v, 0, 1);
  return c * c * (3 - 2 * c);
};
const lerpAngle = (a: number, b: number, t: number) => {
  let d = ((b - a + 540) % 360) - 180;
  if (d < -180) d += 360;
  return a + d * t;
};

function edgePoint(r: DOMRect, side: Side, f: number): Point {
  if (side === 'right') return { x: r.right, y: r.top + f * r.height };
  if (side === 'left') return { x: r.left, y: r.top + f * r.height };
  if (side === 'bottom') return { x: r.left + f * r.width, y: r.bottom };
  return { x: r.left + f * r.width, y: r.top };
}

function offscreenPoint(side: Side, vw: number, vh: number): Point {
  const m = 50;
  if (side === 'left') return { x: -m, y: rand(0.1, 0.9) * vh };
  if (side === 'right') return { x: vw + m, y: rand(0.1, 0.9) * vh };
  if (side === 'top') return { x: rand(0.1, 0.9) * vw, y: -m };
  return { x: rand(0.1, 0.9) * vw, y: vh + m };
}

function createArrow(layer: HTMLElement, color: string, label?: string): Crew & { f: number } {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;visibility:hidden;will-change:transform';
  const rot = document.createElement('div');
  rot.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0';
  rot.innerHTML = `<svg width="20" height="22" viewBox="0 0 20 22" style="position:absolute;left:-2px;top:-2px;overflow:visible;transform-origin:2px 2px;transform:rotate(${TIP_ROTATION}deg)"><path d="${ARROW_PATH}" fill="${color}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
  wrap.appendChild(rot);
  if (label) {
    const tag = document.createElement('span');
    tag.textContent = label.toUpperCase();
    tag.style.cssText = `position:absolute;left:12px;top:9px;padding:1px 5px;background:${color};color:${INK};font:700 9px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;white-space:nowrap`;
    wrap.appendChild(tag);
  }
  layer.appendChild(wrap);
  return { wrap, rot, f: 0.5 };
}

function createBox(layer: HTMLElement) {
  const box = document.createElement('div');
  box.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;border:1px solid ${SELECT};box-sizing:border-box`;
  for (const [x, y] of [['-4px', '-4px'], ['calc(100% - 3px)', '-4px'], ['-4px', 'calc(100% - 3px)'], ['calc(100% - 3px)', 'calc(100% - 3px)']]) {
    const h = document.createElement('span');
    h.style.cssText = `position:absolute;left:${x};top:${y};width:7px;height:7px;background:#fff;border:1px solid ${SELECT};box-sizing:border-box`;
    box.appendChild(h);
  }
  layer.appendChild(box);
  return box;
}

/** Tween an arrow along a curved path. `getTo` is re-read every tick so the target can move (scrolling). */
function fly(
  crew: Crew,
  from: Point,
  getTo: () => Point,
  opts: { duration: number; ease: string; headStart?: number; headEnd?: number },
) {
  const bend = rand(0.18, 0.4) * (Math.random() < 0.5 ? -1 : 1);
  const prog = { p: 0 };
  return gsap.to(prog, {
    p: 1,
    duration: opts.duration,
    ease: opts.ease,
    onUpdate: () => {
      const p = prog.p;
      const e = getTo();
      const mx = (from.x + e.x) / 2;
      const my = (from.y + e.y) / 2;
      const c = { x: mx - (e.y - from.y) * bend, y: my + (e.x - from.x) * bend };
      const q = 1 - p;
      const x = q * q * from.x + 2 * q * p * c.x + p * p * e.x;
      const y = q * q * from.y + 2 * q * p * c.y + p * p * e.y;
      const dx = 2 * q * (c.x - from.x) + 2 * p * (e.x - c.x);
      const dy = 2 * q * (c.y - from.y) + 2 * p * (e.y - c.y);
      let heading = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (opts.headStart !== undefined) heading = lerpAngle(opts.headStart, heading, smooth(p / 0.2));
      if (opts.headEnd !== undefined) heading = lerpAngle(heading, opts.headEnd, smooth((p - 0.7) / 0.3));
      gsap.set(crew.wrap, { x, y });
      gsap.set(crew.rot, { rotation: heading });
    },
  });
}

function buildItem(item: Item, index: number, layer: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const lead = LEAD_EDGE[item.from];
  const pullHeading = PULL_HEADING[item.from];
  const size = item.el.getBoundingClientRect();
  const area = size.width * size.height;
  const fractions = area > 140000 ? [0.14, 0.5, 0.86] : area > 30000 ? [0.28, 0.72] : [0.5]; // spaced apart: no pile-ups

  const crew: Crew[] = fractions.map((f, k) => {
    const founder = FOUNDERS[(index + k) % FOUNDERS.length];
    const arrow = createArrow(layer, founder.field, k === 0 ? founder.name.split(' ')[0] : undefined);
    arrow.f = f;
    return arrow;
  });
  const box = createBox(layer);
  const attach = (a: Crew) => edgePoint(item.el.getBoundingClientRect(), lead, a.f);

  // 1. Arrows emerge from different edges and curve in to the element's leading edge.
  const sides: Side[] = ['left', 'right', 'top', 'bottom'];
  let flightEnd = 0;
  crew.forEach((a, k) => {
    const side = k === 0 ? lead : sides[Math.floor(Math.random() * sides.length)];
    const start = offscreenPoint(side, vw, vh);
    const at = k * 0.1;
    const duration = rand(0.85, 1.2) + k * 0.1;
    gsap.set(a.wrap, { x: start.x, y: start.y });
    tl.set(a.wrap, { autoAlpha: 1 }, at);
    tl.add(fly(a, start, () => attach(a), { duration, ease: 'power2.inOut', headEnd: pullHeading }), at);
    flightEnd = Math.max(flightEnd, at + duration);
  });

  // 2. Hook on: the element appears at its displaced position under the arrows, with a selection box.
  const grab = flightEnd;
  const track = () => {
    const r = item.el.getBoundingClientRect();
    crew.forEach((a) => {
      const p = edgePoint(r, lead, a.f);
      gsap.set(a.wrap, { x: p.x, y: p.y });
      gsap.set(a.rot, { rotation: pullHeading });
    });
    gsap.set(box, { x: r.left - 6, y: r.top - 6, width: r.width + 12, height: r.height + 12 });
  };
  tl.call(track, [], grab - 0.05);
  tl.to(item.el, { opacity: 1, duration: 0.2, ease: 'none' }, grab - 0.04);
  tl.set(box, { autoAlpha: 1 }, grab - 0.04);
  crew.forEach((a) => tl.fromTo(a.rot, { scale: 1 }, { scale: 0.78, duration: 0.09, yoyo: true, repeat: 1 }, grab));

  // 3. Pull: element and arrows travel together into the real layout position.
  const dist = Math.hypot(item.ox, item.oy);
  const pullDuration = 0.85 + Math.min(dist, 420) / 900;
  const pullAt = grab + 0.12;
  tl.to(item.el, { x: 0, y: 0, duration: pullDuration, ease: 'power3.inOut', onUpdate: track }, pullAt);

  // 4. Lock: the box fades and the element settles with a small snap.
  const settle = pullAt + pullDuration;
  tl.to(box, { autoAlpha: 0, duration: 0.35 }, settle + 0.1);
  tl.fromTo(item.el, { scale: 1.014 }, { scale: 1, duration: 0.45, ease: 'back.out(3)', immediateRender: false }, settle);

  // 5. The crew leaves for the edge of the screen and disappears.
  let end = settle + 0.5;
  crew.forEach((a, k) => {
    const at = settle + 0.3 + k * 0.08;
    const duration = rand(0.8, 1.1);
    const exitSide = sides[Math.floor(Math.random() * sides.length)];
    const exit = offscreenPoint(exitSide, vw, vh);
    tl.add(() => {
      const from = { x: Number(gsap.getProperty(a.wrap, 'x')), y: Number(gsap.getProperty(a.wrap, 'y')) };
      fly(a, from, () => exit, { duration, ease: 'power2.in', headStart: pullHeading });
    }, at);
    tl.to(a.wrap, { autoAlpha: 0, duration: 0.2 }, at + duration - 0.2);
    end = Math.max(end, at + duration);
  });

  tl.call(
    () => {
      gsap.set(item.el, { clearProps: 'transform,opacity' }); // hand control back to the stylesheet (hover states etc.)
      crew.forEach((a) => a.wrap.remove());
      box.remove();
    },
    [],
    end + 0.05,
  );
  return tl;
}

export default function AssemblyChoreography() {
  const [ambient, setAmbient] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-team-root]');
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-assemble]'));
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (reduceMotion) {
      root.classList.remove(styles.pending);
      const show = window.setTimeout(() => setAmbient(true), 0);
      return () => window.clearTimeout(show);
    }

    let cancelled = false;
    let layer: HTMLDivElement | null = null;
    let ticking = false;
    const masters: gsap.core.Timeline[] = [];
    const pending = new Set<Item>();
    let firstScene = true;
    let fallback = 0;

    const check = () => {
      ticking = false;
      if (cancelled || !layer) return;
      const vh = window.innerHeight;
      const ready: { item: Item; top: number; left: number }[] = [];
      pending.forEach((item) => {
        const r = item.el.getBoundingClientRect();
        const top = r.top - item.oy; // final position = current box minus the displacement we applied
        const bottom = r.bottom - item.oy;
        if (top >= vh * 0.9) return;
        pending.delete(item);
        if (bottom < 0) gsap.set(item.el, { clearProps: 'transform,opacity' }); // already scrolled past: no show
        else ready.push({ item, top, left: r.left - item.ox });
      });
      if (!ready.length) return;
      ready.sort((a, b) => a.top - b.top || a.left - b.left);

      const master = gsap.timeline();
      ready.forEach(({ item }, i) => master.add(buildItem(item, i, layer!), Math.min(i * 0.2, 2)));
      if (firstScene) {
        firstScene = false;
        master.eventCallback('onComplete', () => setAmbient(true));
      }
      masters.push(master);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    };

    const start = async () => {
      await Promise.race([document.fonts?.ready, new Promise((resolve) => setTimeout(resolve, 1200))]);
      if (cancelled) return;

      layer = document.createElement('div');
      layer.setAttribute('aria-hidden', 'true');
      layer.style.cssText = 'position:fixed;inset:0;z-index:60;pointer-events:none;overflow:hidden';
      document.body.appendChild(layer);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Measure the real layout first, then displace.
      const items: Item[] = targets.map((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const attr = el.dataset.from as Side | undefined;
        const from: Side = attr ?? (cx < vw * 0.4 ? 'left' : cx > vw * 0.6 ? 'right' : 'bottom');
        const dx = clamp(vw * 0.28, 120, 360);
        const dy = clamp(vh * 0.22, 100, 240);
        const ox = from === 'left' ? -dx : from === 'right' ? dx : rand(-20, 20);
        const oy = from === 'top' ? -dy : from === 'bottom' ? dy : rand(-18, 18);
        return { el, from, ox, oy };
      });
      items.forEach((it) => {
        gsap.set(it.el, { opacity: 0, x: it.ox, y: it.oy });
        pending.add(it);
      });
      root.classList.remove(styles.pending); // inline opacity:0 now holds the hidden state

      // The site scrolls inside <body> (not the window), so listen in the capture phase to catch any scroller.
      window.addEventListener('scroll', onScroll, { passive: true, capture: true });
      window.addEventListener('resize', onScroll);
      check();
      fallback = window.setTimeout(() => setAmbient(true), 9000);
    };

    start();

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      masters.forEach((m) => m.kill());
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: 'transform,opacity' });
      root.classList.remove(styles.pending);
      layer?.remove();
    };
  }, []);

  return ambient ? <CursorSwarm followers={7} /> : null;
}
