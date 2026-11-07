'use client';

import { useEffect, useRef, useState } from 'react';
import { FOUNDERS } from './founders';

// Same arrow as before (tip at the top-left), drawn on a canvas and steered every frame.
const ARROW_PATH = 'M2 2 L2 18 L6.5 13.5 L10 21 L13 19.6 L9.6 12.4 L16 12.4 Z';
const CENTER = { x: 8.4, y: 12.6 };
const TIP_ANGLE = Math.atan2(2 - CENTER.y, 2 - CENTER.x);
const INK = '#060608';

type Agent = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ang: number;
  size: number; // doubles as depth: small = far, slower, fainter
  speed: number; // cruising speed, px/s
  ring: number; // preferred orbit radius around a target
  spin: 1 | -1;
  phaseA: number;
  phaseB: number;
  color: string;
  group: number;
  leader: boolean;
  label?: string;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const smoothstep = (v: number) => v * v * (3 - 2 * v);

function makeAgents(w: number, h: number, followers: number): Agent[] {
  const agents: Agent[] = [];
  const make = (group: number, leader: boolean): Agent => {
    const heading = rand(0, Math.PI * 2);
    const size = leader ? 1 : rand(0.5, 0.85);
    const speed = (leader ? 70 : rand(55, 105)) * (0.7 + size * 0.4);
    return {
      x: rand(0, w),
      y: rand(0, h),
      vx: Math.cos(heading) * speed,
      vy: Math.sin(heading) * speed,
      ang: heading,
      size,
      speed,
      ring: rand(50, 150),
      spin: Math.random() < 0.5 ? 1 : -1,
      phaseA: rand(0, 100),
      phaseB: rand(0, 100),
      color: FOUNDERS[group].field,
      group,
      leader,
      label: leader ? FOUNDERS[group].name.split(' ')[0] : undefined,
    };
  };
  FOUNDERS.forEach((_, group) => agents.push(make(group, true)));
  for (let i = 0; i < followers; i++) agents.push(make(i % FOUNDERS.length, false));
  return agents;
}

/**
 * Full-viewport swarm of pointer arrows. Each one has its own speed, size and orbit radius.
 * They wander with noise-driven steering, follow the mouse in a loose ring while it moves,
 * and when it rests they disperse, then slowly converge on a roaming point and spread out again.
 */
export default function CursorSwarm({ followers }: { followers?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const arrow = new Path2D(ARROW_PATH);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const agents = makeAgents(w, h, followers ?? (w < 768 ? 11 : 21));

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const a of agents) {
        a.x = Math.min(Math.max(a.x, 0), w);
        a.y = Math.min(Math.max(a.y, 0), h);
      }
      if (reduceMotion) draw();
    };

    const mouse = { x: w / 2, y: h / 2, vx: 0, vy: 0, moved: -1e9, inside: false };

    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max((now - mouse.moved) / 1000, 0.001);
      if (dt < 0.2) {
        mouse.vx += ((event.clientX - mouse.x) / dt - mouse.vx) * 0.25;
        mouse.vy += ((event.clientY - mouse.y) / dt - mouse.vy) * 0.25;
      }
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.moved = now;
      mouse.inside = true;
    };
    const onLeave = () => {
      mouse.inside = false;
    };

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const ordered = [...agents].sort((p, q) => p.size - q.size); // far ones first
      for (const a of ordered) {
        ctx!.save();
        ctx!.globalAlpha = a.leader ? 1 : 0.45 + a.size * 0.55;
        ctx!.translate(a.x, a.y);
        ctx!.rotate(a.ang - TIP_ANGLE);
        ctx!.scale(a.size, a.size);
        ctx!.translate(-CENTER.x, -CENTER.y);
        ctx!.fillStyle = a.color;
        ctx!.strokeStyle = INK;
        ctx!.lineWidth = 1.2;
        ctx!.lineJoin = 'round';
        ctx!.fill(arrow);
        ctx!.stroke(arrow);
        ctx!.restore();

        if (a.label) {
          ctx!.save();
          ctx!.font = '700 9px ui-monospace, SFMono-Regular, Menlo, monospace';
          const text = a.label.toUpperCase();
          const tw = ctx!.measureText(text).width;
          ctx!.fillStyle = a.color;
          ctx!.fillRect(a.x + 12, a.y + 8, tw + 12, 14);
          ctx!.fillStyle = INK;
          ctx!.fillText(text, a.x + 18, a.y + 18);
          ctx!.restore();
        }
      }
    }

    let t = 0;
    let last = performance.now();
    let mouseW = 0; // 0 = ignoring the pointer, 1 = fully following it
    let frame = 0;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      const active = mouse.inside && now - mouse.moved < 2200;
      mouseW += ((active ? 1 : 0) - mouseW) * (1 - Math.exp(-dt * (active ? 3 : 1.1)));
      mouse.vx *= Math.exp(-dt * 2);
      mouse.vy *= Math.exp(-dt * 2);
      const boost = 1 + Math.min(Math.hypot(mouse.vx, mouse.vy) / 1800, 0.6) * mouseW;

      // A roaming point the swarm drifts toward; the pull swells and fades, so it converges and disperses.
      const targetX = w * (0.5 + 0.36 * Math.sin(t * 0.13) + 0.1 * Math.sin(t * 0.31 + 1.7));
      const targetY = h * (0.5 + 0.32 * Math.sin(t * 0.17 + 2) + 0.08 * Math.cos(t * 0.37));
      const converge = smoothstep(0.5 + 0.5 * Math.sin(t * 0.2));

      const centerX = targetX + (mouse.x - targetX) * mouseW;
      const centerY = targetY + (mouse.y - targetY) * mouseW;
      const pull = Math.max(mouseW, converge * 0.55);
      const ringScale = 1 + (1 - mouseW) * 0.9; // wider orbit around the roaming point than around the cursor

      for (const a of agents) {
        const speed = Math.hypot(a.vx, a.vy) || 1;
        const cruise = a.speed * boost;

        // Organic wander: the heading drifts by a smooth, never-repeating turn rate.
        const turn = Math.sin(t * 0.7 + a.phaseA) * 0.9 + Math.sin(t * 1.9 + a.phaseB) * 0.5;
        const cos = Math.cos(turn * dt);
        const sin = Math.sin(turn * dt);
        const hx = (a.vx * cos - a.vy * sin) / speed;
        const hy = (a.vx * sin + a.vy * cos) / speed;
        let dx = hx * cruise;
        let dy = hy * cruise;

        // Orbit the shared centre at this arrow's own radius, with a swirl so it circles rather than piles up.
        const cx = centerX - a.x;
        const cy = centerY - a.y;
        const dist = Math.hypot(cx, cy) || 1;
        const nx = cx / dist;
        const ny = cy / dist;
        const radial = Math.max(-cruise, Math.min(cruise * 1.6, (dist - a.ring * ringScale) * 0.9));
        const ringX = nx * radial - ny * a.spin * cruise * 0.75;
        const ringY = ny * radial + nx * a.spin * cruise * 0.75;
        dx += (ringX - dx) * pull;
        dy += (ringY - dy) * pull;

        // Followers loosely cling to the leader of their colour; leaders ignore each other.
        if (!a.leader) {
          const lead = agents[a.group];
          const lx = lead.x - a.x;
          const ly = lead.y - a.y;
          const ld = Math.hypot(lx, ly) || 1;
          const want = Math.max(-cruise, Math.min(cruise * 1.3, (ld - 70 - a.ring * 0.4) * 0.8));
          const tie = 0.4 * (1 - mouseW);
          dx += ((lx / ld) * want - dx) * tie;
          dy += ((ly / ld) * want - dy) * tie;
        }

        // Keep personal space.
        for (const o of agents) {
          if (o === a) continue;
          const sx = a.x - o.x;
          const sy = a.y - o.y;
          const sd = Math.hypot(sx, sy);
          if (sd > 0 && sd < 30) {
            const push = (1 - sd / 30) * cruise * 1.2;
            dx += (sx / sd) * push;
            dy += (sy / sd) * push;
          }
        }

        // Ease back from the viewport edges instead of bouncing or wrapping.
        const margin = 70;
        if (a.x < margin) dx += ((margin - a.x) / margin) * cruise * 2;
        else if (a.x > w - margin) dx -= ((a.x - (w - margin)) / margin) * cruise * 2;
        if (a.y < margin) dy += ((margin - a.y) / margin) * cruise * 2;
        else if (a.y > h - margin) dy -= ((a.y - (h - margin)) / margin) * cruise * 2;

        // Steer smoothly toward the desired velocity and clamp the speed range.
        const k = 1 - Math.exp(-dt * 2.4);
        a.vx += (dx - a.vx) * k;
        a.vy += (dy - a.vy) * k;
        const v = Math.hypot(a.vx, a.vy) || 1;
        const lo = a.speed * 0.45;
        const hi = a.speed * 2.1 * boost;
        const clamped = Math.min(Math.max(v, lo), hi);
        a.vx *= clamped / v;
        a.vy *= clamped / v;

        a.x += a.vx * dt;
        a.y += a.vy * dt;

        // Turn the arrow toward its heading along the shortest arc.
        let diff = Math.atan2(a.vy, a.vx) - a.ang;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        a.ang += diff * (1 - Math.exp(-dt * 7));
      }

      draw();
      frame = requestAnimationFrame(step);
    };

    resize();
    setShown(true);
    window.addEventListener('resize', resize);
    if (reduceMotion) {
      draw();
      return () => window.removeEventListener('resize', resize);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    frame = requestAnimationFrame((now) => {
      last = now;
      step(now);
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [followers]);

  // Ambient layer: sits behind the page content and fades in softly once the page has assembled.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] h-full w-full transition-opacity duration-[2500ms]"
      style={{ opacity: shown ? 0.6 : 0 }}
    />
  );
}
