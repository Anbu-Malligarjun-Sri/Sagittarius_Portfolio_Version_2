"use client";
import { useEffect, useRef, type RefObject } from 'react';
import styles from './hero.module.css';

export default function Cursor({ hero }: { hero: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = ref.current, element = hero.current; if (!cursor || !element) return;
    const mouse = matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0, x = 0, y = 0, tx = 0, ty = 0, last = 0, initialized = false;
    const draw = (now: number) => {
      const dt = Math.min(now - last || 16.67, 50); last = now;
      const k = 1 - Math.pow(.7, dt / 16.67); x += (tx - x) * k; y += (ty - y) * k;
      cursor.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      frame = Math.hypot(tx - x, ty - y) > .1 ? requestAnimationFrame(draw) : 0;
    };
    const move = (event: PointerEvent) => {
      if (!mouse.matches || event.pointerType === 'touch') return;
      tx = event.clientX; ty = event.clientY;
      if (!initialized) { x = tx; y = ty; initialized = true; }
      cursor.dataset.visible = 'true'; element.dataset.pointerInside = 'true';
      if (!frame) { last = performance.now(); frame = requestAnimationFrame(draw); }
    };
    const leave = () => { cursor.dataset.visible = 'false'; element.dataset.pointerInside = 'false'; };
    const out = (event: MouseEvent) => { if (!event.relatedTarget) leave(); };
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
    window.addEventListener('mouseout', out); window.addEventListener('blur', leave); mouse.addEventListener('change', leave);
    return () => { cancelAnimationFrame(frame); element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); window.removeEventListener('mouseout', out); window.removeEventListener('blur', leave); mouse.removeEventListener('change', leave); delete element.dataset.pointerInside; };
  }, [hero]);
  return <div ref={ref} className={styles.cursor} aria-hidden="true" />;
}
