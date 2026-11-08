'use client';

import { useEffect, useRef, useState } from 'react';
import { LOGO_PATHS } from './logoPaths';
import { buildHair, hexToRgb, RADIUS } from './plushHair';
import { BASE_FRAGMENT, BASE_VERTEX, HAIR_FRAGMENT, HAIR_VERTEX } from './plushShaders';
import { FUR_COLOR, type Social } from './socials';

const ART_SIZE = 256;
const FOV = 26;
const DISTANCE = 4.85;
const VISIBLE = 2 * DISTANCE * Math.tan((FOV * Math.PI) / 360); // world height visible at the tile plane
const SEGMENTS = 4;

/** Paints the logo, dyed, onto a square canvas. Everything outside the logo stays transparent. */
function paintArtwork(social: Social): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = ART_SIZE;
  const ctx = canvas.getContext('2d')!;
  const size = ART_SIZE * social.scale;
  const offset = (ART_SIZE - size) / 2;
  ctx.translate(offset, offset);
  ctx.scale(size / 24, size / 24);

  if (Array.isArray(social.dye)) {
    const gradient = ctx.createLinearGradient(0, 24, 24, 0);
    social.dye.forEach((stop, i) => gradient.addColorStop(i / (social.dye.length - 1), stop));
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = social.dye;
  }
  ctx.fill(new Path2D(LOGO_PATHS[social.id]));
  return canvas;
}

function FallbackLogo({ social }: { social: Social }) {
  const gradientId = `dye-${social.id}`;
  return (
    <svg viewBox="0 0 24 24" className="h-[56%] w-[56%]" aria-hidden="true">
      {Array.isArray(social.dye) ? (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            {social.dye.map((stop, i) => (
              <stop key={stop} offset={`${(i / (social.dye.length - 1)) * 100}%`} stopColor={stop} />
            ))}
          </linearGradient>
        </defs>
      ) : null}
      <path d={LOGO_PATHS[social.id]} fill={Array.isArray(social.dye) ? `url(#${gradientId})` : social.dye} />
    </svg>
  );
}

/**
 * A plush app-icon: tens of thousands of instanced hairs, dyed and combed by the logo, lit as real fur,
 * parted by the pointer. Until WebGL is up (or if it is unavailable) a flat cream tile with the logo is shown.
 */
export default function PlushTile({ social }: { social: Social }) {
  const wrapRef = useRef<HTMLAnchorElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let disposed = false;
    let started = false;
    let visible = false;
    let running = false;
    let raf = 0;
    let kick: () => void = () => {};
    let dispose: () => void = () => {};

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;

    const init = async () => {
      let THREE: typeof import('three');
      try {
        THREE = await import('three');
      } catch {
        return;
      }
      if (disposed) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch {
        return; // no WebGL: the flat fallback tile stays
      }
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 20);
      camera.position.set(0, 0, DISTANCE);
      const group = new THREE.Group();
      scene.add(group);

      // Artwork -> per-hair colour and the undercoat tint.
      const art = paintArtwork(social);
      const artData = art.getContext('2d')!.getImageData(0, 0, ART_SIZE, ART_SIZE);
      const artTexture = new THREE.CanvasTexture(art);
      artTexture.colorSpace = THREE.NoColorSpace;

      const count = coarse ? 14000 : 30000;
      const hair = buildHair({ count, art: artData, furColor: FUR_COLOR, seed: 7 + social.id.length * 131 });

      // One ribbon strand: SEGMENTS + 1 rows of two vertices. position = (side, t, 0).
      const rows = SEGMENTS + 1;
      const base = new Float32Array(rows * 2 * 3);
      for (let r = 0; r < rows; r++) {
        const t = r / SEGMENTS;
        base.set([-1, t, 0, 1, t, 0], r * 6);
      }
      const index: number[] = [];
      for (let r = 0; r < SEGMENTS; r++) {
        const a = r * 2;
        index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
      const geometry = new THREE.InstancedBufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(base, 3));
      geometry.setIndex(index);
      geometry.setAttribute('iRoot', new THREE.InstancedBufferAttribute(hair.roots, 2));
      geometry.setAttribute('iColor', new THREE.InstancedBufferAttribute(hair.colors, 3));
      geometry.setAttribute('iData', new THREE.InstancedBufferAttribute(hair.data, 4));
      geometry.setAttribute('iClump', new THREE.InstancedBufferAttribute(hair.clump, 2));
      geometry.instanceCount = hair.count;

      const hairUniforms = {
        uTime: { value: 0 },
        uBreeze: { value: reduceMotion ? 0 : 1 },
        uGrow: { value: reduceMotion ? 1 : 0 },
        uPuff: { value: 0.16 },
        uClump: { value: 0.2 },
        uPx: { value: 0.003 },
        uRadius: { value: RADIUS },
        uMouse: { value: new THREE.Vector2(9, 9) },
        uPart: { value: 0 },
      };
      const hairMaterial = new THREE.ShaderMaterial({
        vertexShader: HAIR_VERTEX,
        fragmentShader: HAIR_FRAGMENT,
        uniforms: hairUniforms,
        side: THREE.DoubleSide,
      });
      const hairMesh = new THREE.Mesh(geometry, hairMaterial);
      hairMesh.frustumCulled = false;

      const baseMaterial = new THREE.ShaderMaterial({
        vertexShader: BASE_VERTEX,
        fragmentShader: BASE_FRAGMENT,
        uniforms: { uArt: { value: artTexture }, uFur: { value: new THREE.Vector3(...hexToRgb(FUR_COLOR)) }, uRadius: { value: RADIUS } },
      });
      const baseMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), baseMaterial);
      baseMesh.position.z = -0.002;
      group.add(baseMesh, hairMesh);

      // ---- sizing ----
      const resize = () => {
        const w = Math.max(wrap.clientWidth, 1);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, w, false);
        hairUniforms.uPx.value = VISIBLE / (w * dpr);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);

      // ---- pointer ----
      const target = { x: 9, y: 9, nx: 0, ny: 0, part: 0, press: 0 };
      const mouse = { x: 9, y: 9, nx: 0, ny: 0 };
      let hovering = false;
      const toTile = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
        target.nx = nx;
        target.ny = ny;
        target.x = nx * (VISIBLE / 2);
        target.y = ny * (VISIBLE / 2);
      };
      const onEnter = (e: PointerEvent) => {
        toTile(e);
        if (!hovering) {
          mouse.x = target.x;
          mouse.y = target.y;
        }
        hovering = true;
        kick();
      };
      const onMove = (e: PointerEvent) => {
        toTile(e);
        hovering = true;
        kick();
      };
      const onLeave = () => {
        hovering = false;
        target.press = 0;
        kick();
      };
      const onDown = () => {
        target.press = 1;
        kick();
      };
      const onUp = () => {
        target.press = 0;
      };
      wrap.addEventListener('pointerenter', onEnter);
      wrap.addEventListener('pointermove', onMove);
      wrap.addEventListener('pointerleave', onLeave);
      wrap.addEventListener('pointerdown', onDown);
      window.addEventListener('pointerup', onUp);

      // ---- loop ----
      const clock = new THREE.Clock();
      let grow = reduceMotion ? 1 : 0;
      let lastDraw = 0;

      const draw = (now: number) => {
        if (disposed) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        const idle = !hovering && target.part < 0.01 && grow >= 1 && target.press === 0;
        if (idle && now - lastDraw < 40) {
          raf = requestAnimationFrame(draw); // idle: ~25fps is plenty for the breeze
          return;
        }
        lastDraw = now;

        if (grow < 1) grow = Math.min(1, grow + dt / 1.7);
        hairUniforms.uGrow.value = grow;
        hairUniforms.uTime.value += dt;

        // The pointer parts the fur with a soft attack, and the pile springs back slowly once it leaves.
        const partTarget = hovering ? 1 + target.press * 0.5 : 0;
        target.part += (partTarget - target.part) * (hovering ? 0.14 : 0.05);
        mouse.x += (target.x - mouse.x) * 0.22;
        mouse.y += (target.y - mouse.y) * 0.22;
        mouse.nx += ((hovering ? target.nx : 0) - mouse.nx) * 0.1;
        mouse.ny += ((hovering ? target.ny : 0) - mouse.ny) * 0.1;
        hairUniforms.uMouse.value.set(mouse.x, mouse.y);
        hairUniforms.uPart.value = target.part;

        // The tile leans toward the pointer; pressed, it sinks a touch.
        if (!reduceMotion) {
          group.rotation.y += (mouse.nx * 0.2 - group.rotation.y) * 0.12;
          group.rotation.x += (-mouse.ny * 0.2 - group.rotation.x) * 0.12;
          const s = 1 - target.press * 0.02;
          group.scale.setScalar(group.scale.x + (s - group.scale.x) * 0.2);
        }

        renderer.render(scene, camera);
        if (!visible) {
          running = false;
          return;
        }
        raf = requestAnimationFrame(draw);
      };

      kick = () => {
        if (running || !visible || disposed) return;
        running = true;
        clock.getDelta();
        raf = requestAnimationFrame(draw);
      };

      dispose = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        wrap.removeEventListener('pointerenter', onEnter);
        wrap.removeEventListener('pointermove', onMove);
        wrap.removeEventListener('pointerleave', onLeave);
        wrap.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        geometry.dispose();
        hairMaterial.dispose();
        baseMaterial.dispose();
        baseMesh.geometry.dispose();
        artTexture.dispose();
        renderer.dispose();
      };

      renderer.render(scene, camera);
      setReady(true);
      kick();
    };

    // Build only when the tile is near the screen, and stop drawing when it leaves.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !started) {
          started = true;
          void init();
        } else if (visible) {
          kick();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(wrap);

    return () => {
      disposed = true;
      io.disconnect();
      dispose();
    };
  }, [social]);

  return (
    <a
      ref={wrapRef}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${social.label} (opens in a new tab)`}
      data-cursor-scale="1.4"
      className="group relative block aspect-square w-full select-none rounded-[22%] outline-offset-8 focus-visible:outline-2 focus-visible:outline-[#e8c547]"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Soft pool of light under the tile */}
      <span className="pointer-events-none absolute inset-[6%] rounded-[24%] bg-[radial-gradient(circle,rgba(243,237,228,0.1),transparent_70%)] blur-xl" aria-hidden="true" />

      {/* Flat stand-in until the fur is grown (and the permanent fallback without WebGL) */}
      <span
        className={`absolute inset-[7%] flex items-center justify-center rounded-[24%] bg-[#f3ede4] shadow-[inset_0_2px_10px_rgba(255,255,255,0.6),inset_0_-10px_24px_rgba(120,100,80,0.25),0_18px_40px_rgba(0,0,0,0.5)] transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      >
        <FallbackLogo social={social} />
      </span>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </a>
  );
}
