"use client";

import { useEffect, useRef, type RefObject } from 'react';
import type { LogImages } from './loadImages';
import styles from './hero.module.css';

export type IntroMotion = { zoom: number; pixel: number; active: boolean };
const BRUSH_RADIUS = 240, MASK_SCALE = .5, SPACING = .12;
const FADE_SECONDS = 1.1, MOVING_STRENGTH = .5, RESTING_STRENGTH = .25;
const REST_INTERVAL = .05, MIN_ALPHA = .004;

export default function LogCanvas({ images, motion, hero }: { images: LogImages | null; motion: RefObject<IntroMotion>; hero: RefObject<HTMLElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const clipBox = useRef<HTMLDivElement>(null);
  const imageBox = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = hero.current, output = canvas.current;
    if (!element || !output || !images) return;
    const ctx = output.getContext('2d'); if (!ctx) return;
    const makeCanvas = () => document.createElement('canvas');
    const scene = makeCanvas(), layer = makeCanvas(), mask = makeCanvas(), brush = makeCanvas(), pixelated = makeCanvas();
    const sceneCtx = scene.getContext('2d')!, layerCtx = layer.getContext('2d')!, maskCtx = mask.getContext('2d')!, brushCtx = brush.getContext('2d')!, pixelCtx = pixelated.getContext('2d')!;
    const touch = matchMedia('(hover: none)');
    let width = 0, height = 0, dpr = 1, unit = 1, radius = 1, brushR = 1;
    let imageRect = { x: 0, y: 0, w: 0, h: 0 }, clip = { x: 0, y: 0, w: 0, h: 0 };
    let frame = 0, disposed = false, visible = true, inside = false;
    let px = 0, py = 0, travel = 0, movedAt = 0, stampedAt = 0;
    let stamps: { x: number; y: number; strength: number; born: number }[] = [];
    const resize = () => {
      if (!clipBox.current || !imageBox.current || !probe.current) return;
      const bounds = element.getBoundingClientRect(), box = imageBox.current.getBoundingClientRect(), clipping = clipBox.current.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      if (!width || !height) return;
      dpr = Math.min(devicePixelRatio, 2); unit = probe.current.getBoundingClientRect().width / 100;
      imageRect = { x: box.left - bounds.left, y: box.top - bounds.top, w: box.width, h: box.height };
      clip = { x: clipping.left - bounds.left, y: clipping.top - bounds.top, w: clipping.width, h: clipping.height };
      for (const item of [output, scene, layer]) { item.width = Math.round(width * dpr); item.height = Math.round(height * dpr); }
      mask.width = Math.max(1, Math.round(width * MASK_SCALE)); mask.height = Math.max(1, Math.round(height * MASK_SCALE));
      radius = BRUSH_RADIUS * unit; brushR = Math.max(1, Math.round(radius * MASK_SCALE));
      brush.width = brush.height = brushR * 2;
      const gradient = brushCtx.createRadialGradient(brushR, brushR, 0, brushR, brushR, brushR);
      gradient.addColorStop(0, '#000'); gradient.addColorStop(.45, 'rgba(0,0,0,.85)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
      brushCtx.fillStyle = gradient; brushCtx.fillRect(0, 0, brush.width, brush.height);
      stamps = []; travel = 0; wake();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const bounds = element.getBoundingClientRect(), x = event.clientX - bounds.left, y = event.clientY - bounds.top;
      const now = performance.now() / 1000;
      if (!inside) { inside = true; stamps.push({ x, y, strength: MOVING_STRENGTH, born: now }); travel = 0; }
      else {
        const dx = x - px, dy = y - py, distance = Math.hypot(dx, dy), step = Math.max(1, radius * SPACING);
        for (let d = step - travel; d <= distance; d += step) stamps.push({ x: px + dx * d / distance, y: py + dy * d / distance, strength: MOVING_STRENGTH, born: now });
        travel = (travel + distance) % step;
      }
      px = x; py = y; movedAt = now; stampedAt = now; wake();
    };
    const leave = () => { inside = false; travel = 0; wake(); };
    const out = (event: MouseEvent) => { if (!event.relatedTarget) leave(); };
    function draw(time: number) {
      frame = 0;
      if (disposed || !visible || document.hidden || !width || !height) return;
      const now = time / 1000;
      if (inside && !touch.matches && now - movedAt >= REST_INTERVAL && now - stampedAt >= REST_INTERVAL) {
        stamps.push({ x: px, y: py, strength: RESTING_STRENGTH, born: now }); stampedAt = now;
      }
      maskCtx.clearRect(0, 0, mask.width, mask.height);
      stamps = stamps.filter(stamp => {
        const alpha = stamp.strength * Math.exp(-(now - stamp.born) / FADE_SECONDS);
        if (alpha < MIN_ALPHA) return false;
        maskCtx.globalAlpha = alpha; maskCtx.drawImage(brush, stamp.x * MASK_SCALE - brushR, stamp.y * MASK_SCALE - brushR); return true;
      });
      maskCtx.globalAlpha = 1;
      const zoom = motion.current.zoom, w = imageRect.w * zoom, h = imageRect.h * zoom;
      const x = imageRect.x + (imageRect.w - w) / 2, y = imageRect.y + (imageRect.h - h) / 2;
      sceneCtx.setTransform(dpr, 0, 0, dpr, 0, 0); sceneCtx.clearRect(0, 0, width, height);
      sceneCtx.save(); sceneCtx.beginPath(); sceneCtx.rect(clip.x, clip.y, clip.w, clip.h); sceneCtx.clip();
      sceneCtx.drawImage(images!.bare, x, y, w, h);
      if (touch.matches) sceneCtx.drawImage(images!.moss, x, y, w, h);
      else if (stamps.length) {
        layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0); layerCtx.clearRect(0, 0, width, height);
        layerCtx.drawImage(images!.moss, x, y, w, h);
        layerCtx.globalCompositeOperation = 'destination-in'; layerCtx.drawImage(mask, 0, 0, width, height);
        layerCtx.globalCompositeOperation = 'source-over';
        sceneCtx.drawImage(layer, 0, 0, width, height);
      }
      sceneCtx.restore();
      ctx!.setTransform(1, 0, 0, 1, 0, 0); ctx!.clearRect(0, 0, output!.width, output!.height);
      const block = Math.pow(2, motion.current.pixel);
      if (block > 1.01) {
        const pw = Math.max(1, Math.ceil(width / block)), ph = Math.max(1, Math.ceil(height / block));
        if (pixelated.width !== pw || pixelated.height !== ph) { pixelated.width = pw; pixelated.height = ph; }
        pixelCtx.clearRect(0, 0, pw, ph); pixelCtx.drawImage(scene, 0, 0, pw, ph);
        ctx!.imageSmoothingEnabled = false; ctx!.drawImage(pixelated, 0, 0, output!.width, output!.height);
      } else { ctx!.imageSmoothingEnabled = true; ctx!.drawImage(scene, 0, 0); }
      if (motion.current.active || stamps.length || (inside && !touch.matches)) frame = requestAnimationFrame(draw);
    }
    function wake() { if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(draw); }
    const observer = new ResizeObserver(resize); observer.observe(element);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; inside = false; } }); intersection.observe(element);
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
    window.addEventListener('mouseout', out); window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', wake); touch.addEventListener('change', wake); resize();
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
      element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave);
      window.removeEventListener('mouseout', out); window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', wake); touch.removeEventListener('change', wake);
    };
  }, [images, hero, motion]);
  return <>
    <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
    <div ref={clipBox} className={styles.clipBox} aria-hidden="true"><div ref={imageBox} className={styles.imageBox} /></div>
    <div ref={probe} className={styles.probe} aria-hidden="true" />
  </>;
}
