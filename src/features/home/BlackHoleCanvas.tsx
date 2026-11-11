"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BlackHoleCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const labelsRef = useRef<HTMLDivElement | null>(null);
  // store disposables in refs so they're defined before useEffect runs
  const geometriesRef = useRef<THREE.BufferGeometry[]>([]);
  const materialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Responsive: disable Three.js on small screens
    if (window.innerWidth < 768) {
      // create a static CSS fallback element (styled black hole)
      const fallback = document.createElement('div');
      fallback.style.position = 'absolute';
      fallback.style.inset = '0';
      fallback.style.display = 'flex';
      fallback.style.alignItems = 'center';
      fallback.style.justifyContent = 'center';
      fallback.style.background = 'radial-gradient(circle at 30% 40%, rgba(26,10,46,0.9) 0%, rgba(5,5,5,1) 40%)';
      const hole = document.createElement('div');
      hole.style.width = '42vmin';
      hole.style.height = '42vmin';
      hole.style.borderRadius = '50%';
      hole.style.boxShadow = 'inset 0 0 60px rgba(245,197,24,0.06), 0 0 80px rgba(0,0,0,0.6)';
      hole.style.background = 'radial-gradient(circle at 30% 35%, rgba(245,197,24,0.14), transparent 12%), radial-gradient(circle at 60% 60%, rgba(255,255,255,0.02), transparent 30%), linear-gradient(180deg, rgba(10,10,10,1), rgba(0,0,0,1))';
      fallback.appendChild(hole);
      containerRef.current.appendChild(fallback);
      return () => { try { containerRef.current?.removeChild(fallback); } catch {} };
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.045);
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 3, 12);
    camera.lookAt(0, 0, 0);
    // Performance: enable antialias only on larger screens and reasonable DPR
    const useAntialias = window.innerWidth > 1024 && window.devicePixelRatio <= 1.5;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: useAntialias });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = false;

    // star field (2D canvas behind three) - draw first so Three.js canvas appears above
    const starCanvas = document.createElement('canvas');
    starCanvas.style.position = 'absolute';
    starCanvas.style.inset = '0';
    starCanvas.style.width = '100%';
    starCanvas.style.height = '100%';
    starCanvas.width = width * Math.min(window.devicePixelRatio, 2);
    starCanvas.height = height * Math.min(window.devicePixelRatio, 2);
    const sctx = starCanvas.getContext('2d')!;
    drawStars(sctx, Math.max(120, Math.floor((width * height) / 5000)));
    containerRef.current.appendChild(starCanvas);

    const canvas = renderer.domElement;
    canvas.className = 'three-canvas';
    containerRef.current.appendChild(canvas);

    // black hole group
    const blackHoleGroup = new THREE.Group();
    const pulseGroup = new THREE.Group();
    blackHoleGroup.add(pulseGroup);
    scene.add(blackHoleGroup);

    // use refs to collect disposables
    const geometries = geometriesRef.current;
    const materials = materialsRef.current;

    // core (void)
    const coreGeo = new THREE.SphereGeometry(1.16, 64, 64);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    blackHoleGroup.add(core);

    const shellGeo = new THREE.SphereGeometry(1.48, 64, 64);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x030303,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.scale.set(1.05, 0.82, 1.05);
    blackHoleGroup.add(shell);
    geometries.push(shellGeo);
    materials.push(shellMat);

    const haloGeo = new THREE.SphereGeometry(2.2, 48, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x231100,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.scale.set(1.2, 0.82, 1.2);
    blackHoleGroup.add(halo);
    geometries.push(haloGeo);
    materials.push(haloMat);

    // accretion rings
    const ringGroup = new THREE.Group();
    const hotArcMat = new THREE.MeshBasicMaterial({
      color: 0xe8c547,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const emberMat = new THREE.MeshBasicMaterial({
      color: 0xff7a1a,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const coldMat = new THREE.MeshBasicMaterial({
      color: 0xb8d8ff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.92, 0.18, 24, 160), hotArcMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.34, 0.09, 24, 160), emberMat);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.95, 0.05, 24, 160), coldMat);
    ring1.rotation.z = 0.5;
    ring2.rotation.z = -0.2;
    ring3.rotation.z = 0.85;
    ringGroup.add(ring1, ring2, ring3);
    ringGroup.rotation.x = Math.PI / 3.4;
    ringGroup.rotation.z = -0.22;
    blackHoleGroup.add(ringGroup);
    materials.push(hotArcMat, emberMat, coldMat);

    const streamGeo = new THREE.TorusGeometry(2.55, 0.03, 12, 80, Math.PI * 1.18);
    const streamMat = new THREE.MeshBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const stream = new THREE.Mesh(streamGeo, streamMat);
    stream.rotation.x = Math.PI / 3.55;
    stream.rotation.z = 1.3;
    blackHoleGroup.add(stream);
    geometries.push(streamGeo);
    materials.push(streamMat);

    const streakGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-4.8, 0.08, -0.9),
      new THREE.Vector3(-3.2, 0.12, -0.35),
      new THREE.Vector3(-2.2, 0.22, 0.0),
      new THREE.Vector3(-1.5, 0.26, 0.18),
      new THREE.Vector3(-0.85, 0.18, 0.12),
    ]);
    const streakMat = new THREE.LineBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
    });
    const streak = new THREE.Line(streakGeo, streakMat);
    streak.rotation.set(0.22, -0.18, -0.2);
    blackHoleGroup.add(streak);
    geometries.push(streakGeo);
    materials.push(streakMat);

    // orbital orbits
    const orbitsConfig = [
      { radius: 3.9, speed: 0.010, label: 'TARS', angle: Math.PI * 0.8, offset: 0.08 },
      { radius: 5.1, speed: 0.006, label: 'RAG AI', angle: Math.PI * 0.2, offset: -0.05 },
      { radius: 6.4, speed: 0.004, label: 'SMART GLASS', angle: Math.PI * 1.5, offset: 0.12 },
      { radius: 7.7, speed: 0.0025, label: 'SCI-AI', angle: Math.PI * 1.1, offset: -0.08 },
    ];

    const orbitNodes: THREE.Mesh[] = [];
    const orbitGlows: THREE.Mesh[] = [];

    orbitsConfig.forEach((o) => {
      const curve = new THREE.EllipseCurve(0, 0, o.radius, o.radius * (0.3 + o.offset), 0, 2 * Math.PI, false, 0);
      const pts = curve.getPoints(220).map((p) => new THREE.Vector3(p.x, 0, p.y));
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const orbitMat = new THREE.LineBasicMaterial({ color: 0xF5C518, transparent: true, opacity: 0.12 });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = Math.PI / 7;
      orbitLine.rotation.z = o.offset * 0.8;
      scene.add(orbitLine);
      geometries.push(orbitGeo);
      materials.push(orbitMat);

      const nodeGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xF5C518, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.95 });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const glowGeo = new THREE.SphereGeometry(0.42, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({ color: 0xF5C518, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      scene.add(node);
      scene.add(glow);
      node.userData = { label: o.label };
      orbitNodes.push(node);
      orbitGlows.push(glow);
      geometries.push(nodeGeo, glowGeo);
      materials.push(nodeMat, glowMat);

      // create HTML label
      if (labelsRef.current) {
        const el = document.createElement('div');
        el.className = 'orbit-label';
        el.textContent = o.label;
        el.style.position = 'absolute';
        el.style.fontFamily = "'Space Mono', monospace";
        el.style.fontSize = '11px';
        el.style.letterSpacing = '2px';
        el.style.color = '#F5C518';
        el.style.opacity = '0.85';
        labelsRef.current.appendChild(el);
      }
    });

    // SVG overlay for connector lines
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.inset = '0';
    svg.style.pointerEvents = 'none';
    const lines: SVGLineElement[] = [];
    if (labelsRef.current) labelsRef.current.appendChild(svg);
    orbitsConfig.forEach(() => {
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('stroke', '#F5C518');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('opacity', '0.2');
      svg.appendChild(line);
      lines.push(line);
    });

    // tooltip element
    let tooltip: HTMLDivElement | null = null;
    if (labelsRef.current) {
      tooltip = document.createElement('div');
      tooltip.style.position = 'absolute';
      tooltip.style.padding = '8px 10px';
      tooltip.style.borderRadius = '8px';
      tooltip.style.background = 'rgba(10,10,10,0.9)';
      tooltip.style.color = '#F5C518';
      tooltip.style.fontFamily = "'Space Mono', monospace";
      tooltip.style.fontSize = '12px';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.opacity = '0';
      tooltip.style.transition = 'opacity 180ms ease, transform 180ms ease';
      labelsRef.current.appendChild(tooltip);
    }

    // raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    canvas.addEventListener('mousemove', onMouseMove);

    // parallax targets
    let targetCameraX = 0;
    let targetCameraY = 0;
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handleDocMouse = (e: MouseEvent) => {
      if (reduceMotion) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      targetCameraX = x * 0.8;
      targetCameraY = -y * 0.4;
    };
    document.addEventListener('mousemove', handleDocMouse);

    let time = 0;
    let lastFrame = performance.now();

    // smoothing state for labels
    const labelPositions: { x: number; y: number }[] = orbitsConfig.map(() => ({ x: 0, y: 0 }));

    function animate() {
      const now = performance.now();
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      time += dt;
      blackHoleGroup.rotation.y += 0.0016;
      pulseGroup.rotation.y -= 0.0026;
      pulseGroup.rotation.z = Math.sin(time * 0.35) * 0.08;
      halo.scale.x = 1.16 + Math.sin(time * 0.9) * 0.03;
      halo.scale.z = 1.16 + Math.cos(time * 0.7) * 0.03;

      orbitsConfig.forEach((orbit, i) => {
        const angle = orbit.angle + time * orbit.speed * 60;
        const x = Math.cos(angle) * orbit.radius;
        const z = Math.sin(angle) * orbit.radius * 0.34;
        orbitNodes[i].position.set(x, 0, z);
        orbitGlows[i].position.set(x, 0, z);
      });

      const pulse = Math.sin(time * 2.4) * 0.03 + 1;
      if (!reduceMotion) {
        ring1.scale.set(pulse, pulse * 0.96, 1);
        ring2.scale.set(1 + Math.sin(time * 1.3) * 0.02, 1 + Math.cos(time * 1.1) * 0.025, 1);
      }

      // camera lerp
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY + 3 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // hover detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(orbitNodes);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        hit.scale.set(2, 2, 2);
        canvas.style.cursor = 'pointer';

        // tooltip
        if (labelsRef.current && tooltip) {
          const idx = orbitNodes.indexOf(hit);
          const labelEl = labelsRef.current.children[idx] as HTMLElement | undefined;
          const pos = hit.position.clone();
          pos.project(camera);
          const lx = (pos.x * 0.5 + 0.5) * width;
          const ly = (-pos.y * 0.5 + 0.5) * height;
          tooltip.textContent = hit.userData?.label ?? 'Info';
          tooltip.style.transform = `translate(${lx + 12}px, ${ly - 28}px)`;
          tooltip.style.opacity = '1';
        }
      } else {
        orbitNodes.forEach((n) => n.scale.set(1, 1, 1));
        canvas.style.cursor = 'default';
        if (tooltip) {
          tooltip.style.opacity = '0';
        }
      }

      // update HTML labels and connector lines
      if (labelsRef.current) {
        const children = Array.from(labelsRef.current.children).filter((n) => (n as HTMLElement).className === 'orbit-label') as HTMLElement[];
        orbitNodes.forEach((node, i) => {
          const pos = node.position.clone();
          pos.project(camera);
          const x = (pos.x * 0.5 + 0.5) * width;
          const y = (-pos.y * 0.5 + 0.5) * height;
          // simple lerp smoothing
          const prev = labelPositions[i];
          prev.x += (x - prev.x) * 0.12;
          prev.y += (y - prev.y) * 0.12;
          const lx = prev.x + 12;
          const ly = prev.y - 8;
          const el = children[i];
          if (el) {
            el.style.transform = `translate(${lx}px, ${ly}px)`;
            const line = lines[i];
            if (line) {
              line.setAttribute('x1', String(prev.x));
              line.setAttribute('y1', String(prev.y));
              line.setAttribute('x2', String(lx));
              line.setAttribute('y2', String(ly));
            }
          }
        });
      }

      renderer.render(scene, camera);
      req = requestAnimationFrame(animate);
    }

    let req = requestAnimationFrame(animate);

    function onResize() {
      const w = containerRef.current?.clientWidth ?? 1;
      const h = containerRef.current?.clientHeight ?? 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // resize star canvas
      if (starCanvas) {
        starCanvas.width = w * Math.min(window.devicePixelRatio, 2);
        starCanvas.height = h * Math.min(window.devicePixelRatio, 2);
        const ctx = starCanvas.getContext('2d');
        if (ctx) drawStars(ctx, Math.max(120, Math.floor((w * h) / 5000)));
      }
      // update svg size
      if (svg) {
        svg.setAttribute('width', String(w));
        svg.setAttribute('height', String(h));
      }
    }

    window.addEventListener('resize', onResize);

    function cleanup() {
      cancelAnimationFrame(req);
      canvas.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousemove', handleDocMouse);
      window.removeEventListener('resize', onResize);
      try {
        if (containerRef.current?.contains(canvas)) containerRef.current.removeChild(canvas);
        if (containerRef.current?.contains(starCanvas)) containerRef.current.removeChild(starCanvas);
        if (labelsRef.current?.contains(svg)) labelsRef.current.removeChild(svg);
      } catch (e) {
        /* ignore DOM removal errors */
      }

      // dispose geometries and materials
      geometriesRef.current.forEach((g) => { try { g.dispose(); } catch { } });
      materialsRef.current.forEach((m) => { try { m.dispose(); } catch { } });

      renderer.dispose();
      scene.clear();
    }

    return cleanup;
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
      <div ref={labelsRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
    </div>
  );
}

function drawStars(ctx: CanvasRenderingContext2D, count = 200) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 1.5 + 0.3;
    const opacity = Math.random() * 0.6 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.fill();
  }
}
