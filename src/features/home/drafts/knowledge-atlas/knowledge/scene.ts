import * as THREE from 'three';
import { CROSS_LINKS, DOMAINS, STUDIES } from './studies';

export type KnowledgeScene = { focus: (id: string | null) => void; pause: (value: boolean) => void; orbit: (x: number, y: number) => void; zoom: (amount: number) => void; refresh: () => void; dispose: () => void };

export function createKnowledgeScene(host: HTMLDivElement, labels: Map<string, HTMLButtonElement>, onUnavailable: () => void): KnowledgeScene {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setClearColor(0x000000, 0);
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight('#ffffff', 1.1));
  const key = new THREE.DirectionalLight('#fff0d5', 4); key.position.set(-4, 7, 9); scene.add(key);
  const rim = new THREE.DirectionalLight('#9ccaff', 3); rim.position.set(5, -3, 2); scene.add(rim);
  const group = new THREE.Group();
  scene.add(group);
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  const positions = new Map<string, THREE.Vector3>([['stem', new THREE.Vector3()]]);
  const colors = new Map<string, string>([['stem', '#f0eddf']]);
  DOMAINS.forEach((domain, index) => {
    const angle = index / DOMAINS.length * Math.PI * 2 + Math.PI / 6;
    const center = new THREE.Vector3(Math.cos(angle) * 4.1, Math.sin(angle) * 2.45, index % 2 ? -1.5 : 1.2);
    positions.set(domain.id, center);
    colors.set(domain.id, domain.color);
    STUDIES.filter(study => study.domain === domain.id).forEach((study, leaf) => {
      const a = angle + (leaf - 2) * .58;
      positions.set(study.id, center.clone().add(new THREE.Vector3(Math.cos(a) * (1.15 + leaf % 2 * .4), Math.sin(a) * 1.45, Math.sin(leaf * 2.4 + index) * 1.35)));
      colors.set(study.id, domain.color);
    });
  });
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = glowCanvas.height = 64;
  const ctx = glowCanvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, '#fff'); gradient.addColorStop(.15, '#ffffffc0'); gradient.addColorStop(.45, '#ffffff25'); gradient.addColorStop(1, '#ffffff00');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
  const glow = new THREE.CanvasTexture(glowCanvas);
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const spheres = new Map<string, THREE.Mesh>();
  const sphereGeometry = new THREE.SphereGeometry(1, 24, 16);
  geometries.push(sphereGeometry);
  const ringGeometry = new THREE.TorusGeometry(.27, .008, 6, 56);
  geometries.push(ringGeometry);
  positions.forEach((position, id) => {
    const hub = id === 'stem' || DOMAINS.some(d => d.id === id);
    const material = new THREE.MeshPhysicalMaterial({ color: colors.get(id), metalness: .32, roughness: .23, clearcoat: 1, emissive: colors.get(id), emissiveIntensity: .22 });
    const mesh = new THREE.Mesh(sphereGeometry, material);
    mesh.position.copy(position); mesh.scale.setScalar(id === 'stem' ? .16 : hub ? .115 : .065);
    group.add(mesh); materials.push(material); spheres.set(id, mesh);
    if (hub) {
      const ringMaterial = new THREE.MeshBasicMaterial({ color: colors.get(id), transparent: true, opacity: .45 });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(position); ring.rotation.set(.6, -.4, .3); group.add(ring); materials.push(ringMaterial);
      if (id === 'stem') ring.scale.setScalar(1.5);
    }
    const haloMaterial = new THREE.SpriteMaterial({ map: glow, color: colors.get(id), transparent: true, opacity: hub ? .6 : .35, depthWrite: false, blending: THREE.AdditiveBlending });
    const halo = new THREE.Sprite(haloMaterial);
    halo.position.copy(position); halo.scale.setScalar(hub ? .95 : .55);
    group.add(halo); materials.push(haloMaterial);
  });
  const connect = (a: string, b: string, faint = false) => {
    const start = positions.get(a)!; const end = positions.get(b)!;
    const middle = start.clone().lerp(end, .5); middle.z += faint ? -.6 : .3;
    const curve = new THREE.QuadraticBezierCurve3(start, middle, end);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
    const material = new THREE.LineBasicMaterial({ color: colors.get(b), transparent: true, opacity: faint ? .2 : .55 });
    group.add(new THREE.Line(geometry, material)); geometries.push(geometry); materials.push(material);
  };
  DOMAINS.forEach(domain => connect('stem', domain.id));
  STUDIES.forEach(study => connect(study.domain, study.id));
  CROSS_LINKS.forEach(([a, b]) => connect(a, b, true));

  let width = 1, height = 1, overviewDistance = 15, zoomOffset = 0, selected: string | null = null;
  let paused = false, visible = true, disposed = false, unavailable = false, frame = 0, last = 0;
  let drag: { id: number; x: number; y: number } | null = null;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const target = new THREE.Vector3(); const desiredTarget = new THREE.Vector3();
  const desiredCamera = new THREE.Vector3(); const world = new THREE.Vector3(); const projected = new THREE.Vector3();
  const screenPositions = new Map<string, { x: number; y: number; visible: boolean }>();
  const resize = () => {
    width = host.clientWidth; height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height; camera.updateProjectionMatrix();
    overviewDistance = Math.max(13.2, 14 / camera.aspect);
    renderer.setSize(width, height);
    if (!selected) { camera.position.set(0, 0, overviewDistance); target.set(0, 0, 0); }
    wake();
  };
  function draw(now: number) {
    frame = 0;
    if (disposed || unavailable || !visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000 || .016, .05); last = now;
    if (!paused && !motion.matches && !selected && !drag) group.rotation.y += dt * .045;
    group.updateMatrixWorld(true);
    desiredTarget.set(0, 0, 0);
    if (selected) desiredTarget.copy(positions.get(selected)!).applyMatrix4(group.matrixWorld);
    if (selected && width > 760) desiredTarget.x += 1.5;
    desiredCamera.copy(desiredTarget).add(world.set(0, 0, Math.max(4, (selected ? (DOMAINS.some(d => d.id === selected) ? 10 : 8) : overviewDistance) + zoomOffset)));
    const ease = motion.matches ? 1 : 1 - Math.exp(-dt * 5);
    camera.position.lerp(desiredCamera, ease); target.lerp(desiredTarget, ease);
    camera.lookAt(target); camera.updateMatrixWorld();
    positions.forEach((position, id) => {
      const label = labels.get(id); if (!label) return;
      projected.copy(position).applyMatrix4(group.matrixWorld).project(camera);
      const x = (projected.x + 1) * width / 2, y = (1 - projected.y) * height / 2;
      const inView = projected.z > -1 && projected.z < 1 && x > 22 && x < width - 22 && y > 22 && y < height - 22;
      label.style.visibility = inView ? 'visible' : 'hidden';
      label.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      label.style.zIndex = String(id === selected ? 100 : Math.round((1 - projected.z) * 100));
      screenPositions.set(id, { x, y, visible: inView });
      spheres.get(id)!.scale.setScalar(id === selected ? .19 : id === 'stem' ? .2 : DOMAINS.some(d => d.id === id) ? .15 : .09);
    });
    // Prefer the focused subject and branch names; move nearby captions above
    // their points when needed, rather than printing labels over each other.
    const occupied: { left: number; right: number; top: number; bottom: number }[] = [];
    const selectedDomain = STUDIES.find(study => study.id === selected)?.domain ?? selected;
    const ordered = [...positions.keys()].sort((a, b) => {
      const rank = (id: string) => id === selected ? 0 : id === 'stem' || DOMAINS.some(d => d.id === id) ? 1 : 2;
      return rank(a) - rank(b);
    });
    ordered.forEach(id => {
      const label = labels.get(id); const point = screenPositions.get(id); if (!label || !point?.visible) return;
      const caption = label.lastElementChild as HTMLElement;
      const wanted = host.dataset.labels === 'true' || id === selected || id === 'stem' || DOMAINS.some(d => d.id === id) || STUDIES.some(s => s.id === id && s.domain === selectedDomain);
      label.dataset.crowded = 'false'; label.style.setProperty('--label-top', '36px');
      if (!wanted) return;
      const w = caption.offsetWidth, h = caption.offsetHeight;
      let placed = false;
      for (const top of [36, -h - 6]) {
        const box = { left: point.x - w / 2, right: point.x + w / 2, top: point.y - 22 + top, bottom: point.y - 22 + top + h };
        if (box.left < 0 || box.right > width || box.top < 0 || box.bottom > height || occupied.some(other => box.left < other.right + 5 && box.right > other.left - 5 && box.top < other.bottom + 4 && box.bottom > other.top - 4)) continue;
        occupied.push(box); label.style.setProperty('--label-top', `${top}px`); placed = true; break;
      }
      label.dataset.crowded = String(!placed);
    });
    renderer.render(scene, camera);
    const moving = camera.position.distanceToSquared(desiredCamera) > .00001 || target.distanceToSquared(desiredTarget) > .00001;
    if (moving || (!paused && !motion.matches && !selected) || drag) frame = requestAnimationFrame(draw);
  }
  function wake() { if (!frame && !disposed && !unavailable && visible && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(draw); } }
  const down = (event: PointerEvent) => {
    if ((event.target as HTMLElement).closest('button') || (event.pointerType === 'mouse' && event.button !== 0)) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    host.setPointerCapture(event.pointerId); wake();
  };
  const move = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    group.rotation.y += (event.clientX - drag.x) * .005;
    group.rotation.x = THREE.MathUtils.clamp(group.rotation.x + (event.clientY - drag.y) * .003, -.65, .65);
    drag.x = event.clientX; drag.y = event.clientY; wake();
  };
  const up = () => { drag = null; };
  const contextLost = (event: Event) => {
    event.preventDefault(); unavailable = true; cancelAnimationFrame(frame); frame = 0; onUnavailable();
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  host.addEventListener('pointerdown', down); host.addEventListener('pointermove', move);
  host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up); host.addEventListener('lostpointercapture', up);
  const observer = new ResizeObserver(resize); observer.observe(host);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; } }); intersection.observe(host);
  document.addEventListener('visibilitychange', wake); motion.addEventListener('change', wake);
  resize();
  return {
    focus(id) { selected = id && positions.has(id) ? id : null; zoomOffset = 0; if (!selected) group.rotation.set(.08, -.14, -.06); wake(); },
    pause(value) { paused = value; wake(); },
    refresh: wake,
    orbit(x, y) { group.rotation.y += x; group.rotation.x = THREE.MathUtils.clamp(group.rotation.x + y, -.85, .85); wake(); },
    zoom(amount) { zoomOffset = THREE.MathUtils.clamp(zoomOffset + amount, -4, 8); wake(); },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
      host.removeEventListener('pointerdown', down); host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerup', up); host.removeEventListener('pointercancel', up); host.removeEventListener('lostpointercapture', up);
      document.removeEventListener('visibilitychange', wake); motion.removeEventListener('change', wake);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); glow.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
