import type * as ThreeNamespace from 'three';
import { PaperSim } from './paperPhysics';
import { layoutLetter, makeGrain, paintLetter, TEX_W } from './paperTexture';
import type { PaperFonts } from './paperTexture';

type Three = typeof ThreeNamespace;

/*
 * The sheet of paper in 3D: a mesh that follows the physics, lit from the upper left so every fold casts a shadow and
 * catches the light, lying on a desk that only shows its shadow. Press and hold to squeeze it, drag to pull it about,
 * let go and it relaxes. Moving over it without pressing sends a small ripple across it.
 */

const MARGIN_X = 0.14; // empty desk either side of the sheet, in sheet widths
const MARGIN_Y = 0.09; // and above and below it
const TARGET_BODY_CSS_PX = 15.5; // how big the letter's text should look on screen
const FOV = 26;
const STEP = 1 / 60;
const MAX_TEXTURE_PIXELS = 8 * 1024 * 1024;
const MAX_DRAWING_PIXELS = 6 * 1024 * 1024;

export type PaperScene = {
  /** The width : height the canvas should be given. */
  canvasAspect: number;
  /** The container width (px) this layout was made for. */
  layoutWidth: number;
  resize: () => void;
  setVisible: (visible: boolean) => void;
  dispose: () => void;
};

type Options = {
  fonts: PaperFonts;
  /** The width the canvas will be shown at, used to decide how long the sheet must be for the text to be readable. */
  containerWidth: number;
  /** Told when the sheet starts and stops moving (it stops drawing when it has settled). */
  onActive?: (active: boolean) => void;
};

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

export function createPaperScene(THREE: Three, canvas: HTMLCanvasElement, { fonts, containerWidth, onActive }: Options): PaperScene {
  // Make the renderer first: if WebGL is unavailable this throws before anything else has been made.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // ── how long the sheet must be: set the text at a readable size for this width, then measure it ──
  const paperOnScreen = containerWidth / (1 + MARGIN_X * 2);
  let bodyPx = clamp((TARGET_BODY_CSS_PX * TEX_W) / paperOnScreen, 22, 56);
  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) {
    renderer.dispose();
    throw new Error('2D canvas unavailable');
  }
  let layout = layoutLetter(measure, fonts, bodyPx);
  while (layout.height / TEX_W > 3.2 && bodyPx > 20) {
    bodyPx -= 1;
    layout = layoutLetter(measure, fonts, bodyPx);
  }
  const aspect = clamp(layout.height / TEX_W, 1.3, 3.2);
  const textureHeight = Math.ceil(TEX_W * aspect);
  const textureScale = Math.min(
    2,
    renderer.capabilities.maxTextureSize / Math.max(TEX_W, textureHeight),
    Math.sqrt(MAX_TEXTURE_PIXELS / (TEX_W * textureHeight)),
  );

  const letterCanvas = document.createElement('canvas');
  paintLetter(letterCanvas, layout, textureHeight, textureScale);

  // ── the sheet ──
  const cols = 30;
  const rows = Math.round((aspect / 1) * (cols - 1)) + 1;
  const sim = new PaperSim(cols, rows, 1, aspect);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(sim.pos, 3));
  const uv = new Float32Array(sim.count * 2);
  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      const i = iy * cols + ix;
      uv[i * 2] = ix / (cols - 1);
      uv[i * 2 + 1] = 1 - iy / (rows - 1);
    }
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  const index: number[] = [];
  for (let iy = 0; iy < rows - 1; iy++) {
    for (let ix = 0; ix < cols - 1; ix++) {
      const a = iy * cols + ix;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      index.push(a, c, b, b, c, d);
    }
  }
  geometry.setIndex(index);
  geometry.computeVertexNormals();

  const texture = new THREE.CanvasTexture(letterCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const grain = new THREE.CanvasTexture(makeGrain());
  grain.wrapS = THREE.RepeatWrapping;
  grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(3, 3 * aspect);

  const backColour = new THREE.Color('#ece2cb');
  const material = new THREE.MeshStandardMaterial({ map: texture, bumpMap: grain, bumpScale: 0.9, roughness: 0.94, metalness: 0, side: THREE.DoubleSide });
  // The back of the paper is blank: without this the letter would show through, mirrored, wherever the sheet folds over.
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uBack = { value: backColour };
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uBack;').replace(
      '#include <map_fragment>',
      `#ifdef USE_MAP
        vec4 sampledDiffuseColor = texture2D( map, vMapUv );
        if ( !gl_FrontFacing ) sampledDiffuseColor = vec4( uBack, 1.0 );
        diffuseColor *= sampledDiffuseColor;
      #endif`,
    );
  };
  material.customProgramCacheKey = () => 'about-paper-letter';

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;

  const group = new THREE.Group();
  group.rotation.set(-0.05, 0.025, 0);
  group.add(mesh);

  // the desk: invisible, it only catches the sheet's shadow
  const deskGeometry = new THREE.PlaneGeometry(6, 6 * aspect);
  const deskMaterial = new THREE.ShadowMaterial({ opacity: 0.42 });
  const desk = new THREE.Mesh(deskGeometry, deskMaterial);
  desk.position.z = -0.012;
  desk.receiveShadow = true;
  group.add(desk);

  const scene = new THREE.Scene();
  scene.add(group);
  const ambient = new THREE.AmbientLight('#fff4e0', 0.85);
  const sun = new THREE.DirectionalLight('#fff1d6', 2.7);
  sun.position.set(-0.75, 0.95, 1.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const reach = Math.max(1.6, aspect * 0.8 + 0.4);
  sun.shadow.camera.left = -reach;
  sun.shadow.camera.right = reach;
  sun.shadow.camera.top = reach;
  sun.shadow.camera.bottom = -reach;
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 6;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.012;
  scene.add(ambient, sun, sun.target);

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 20);

  const worldW = 1 + MARGIN_X * 2;
  const worldH = aspect + MARGIN_Y * 2;
  const canvasAspect = worldW / worldH;

  const fit = (width: number, height: number) => {
    camera.aspect = width / height;
    const tan = Math.tan((FOV * Math.PI) / 360);
    const distance = Math.max(worldH / 2 / tan, worldW / 2 / (tan * camera.aspect));
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };

  // ── touch ──
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const inverse = new THREE.Matrix4();
  const localRay = new THREE.Ray();
  const surface = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  /** Where on the sheet the pointer is, in the sheet's own units. */
  const onSheet = (event: PointerEvent): { x: number; y: number } | null => {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return null;
    ndc.set(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    group.updateMatrixWorld();
    inverse.copy(group.matrixWorld).invert();
    localRay.copy(raycaster.ray).applyMatrix4(inverse);
    return localRay.intersectPlane(surface, hit) ? { x: hit.x, y: hit.y } : null;
  };
  const insideSheet = (p: { x: number; y: number }, slack = 0.04) => Math.abs(p.x) <= 0.5 + slack && Math.abs(p.y) <= aspect / 2 + slack;

  // ── the loop: draws while the sheet is moving, and stops once it has settled ──
  let disposed = false;
  let visible = true;
  let running = false;
  let raf = 0;
  let last = 0;
  let accumulator = 0;
  let calm = 0;

  const frame = (now: number) => {
    raf = 0;
    if (disposed) return;
    if (!visible) {
      running = false;
      onActive?.(false);
      return;
    }
    accumulator += Math.min(0.05, (now - last) / 1000);
    last = now;
    let metrics = { disp: 1, speed: 1 };
    let steps = 0;
    while (accumulator >= STEP && steps < 4) {
      if (sim.grab) sim.grab.strength = Math.min(1, sim.grab.strength + STEP / 0.7);
      metrics = sim.step();
      accumulator -= STEP;
      steps += 1;
    }
    if (steps === 4) accumulator = 0; // fell behind: do not try to catch up
    if (steps > 0) {
      (geometry.attributes.position as ThreeNamespace.BufferAttribute).needsUpdate = true;
      geometry.computeVertexNormals();
    }
    renderer.render(scene, camera);

    calm = !sim.grab && metrics.disp < 0.0007 && metrics.speed < 0.00012 ? calm + 1 : 0;
    if (calm > 24) {
      running = false;
      onActive?.(false);
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  const wake = () => {
    if (running || disposed) return;
    running = true;
    last = performance.now();
    accumulator = 0;
    calm = 0;
    onActive?.(true);
    raf = requestAnimationFrame(frame);
  };

  const release = (event?: PointerEvent) => {
    sim.grab = null;
    if (event && canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    wake();
  };

  const onDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const p = onSheet(event);
    if (!p || !insideSheet(p)) return;
    sim.grab = { x: p.x, y: p.y, strength: 0 };
    canvas.setPointerCapture(event.pointerId);
    wake();
  };
  const onMove = (event: PointerEvent) => {
    const p = onSheet(event);
    if (!p) return;
    if (sim.grab) {
      sim.grab.x = clamp(p.x, -0.6, 0.6);
      sim.grab.y = clamp(p.y, -aspect / 2 - 0.1, aspect / 2 + 0.1);
      wake();
    } else if (event.pointerType === 'mouse' && insideSheet(p, 0)) {
      const speed = Math.hypot(event.movementX, event.movementY);
      if (speed > 3) {
        sim.poke(p.x, p.y, Math.min(0.016, speed * 0.0005));
        wake();
      }
    }
  };
  const onUp = (event: PointerEvent) => release(event);
  // a long press on a phone must squeeze the paper, not open the browser's menu
  const onMenu = (event: Event) => event.preventDefault();
  canvas.addEventListener('contextmenu', onMenu);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('lostpointercapture', onUp);

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height || disposed) return;
    const pixelRatio = Math.min(
      (window.devicePixelRatio || 1) * (window.visualViewport?.scale ?? 1),
      3,
      renderer.capabilities.maxTextureSize / Math.max(width, height),
      Math.sqrt(MAX_DRAWING_PIXELS / (width * height)),
    );
    if (canvas.width !== Math.floor(width * pixelRatio) || canvas.height !== Math.floor(height * pixelRatio)) {
      renderer.setDrawingBufferSize(width, height, pixelRatio);
    }
    fit(width, height);
    wake();
  };
  window.addEventListener('resize', resize);
  window.visualViewport?.addEventListener('resize', resize);

  return {
    canvasAspect,
    layoutWidth: containerWidth,
    resize,
    setVisible: (value) => {
      visible = value;
      if (value) wake();
    },
    dispose: () => {
      disposed = true;
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('lostpointercapture', onUp);
      canvas.removeEventListener('contextmenu', onMenu);
      geometry.dispose();
      material.dispose();
      deskGeometry.dispose();
      deskMaterial.dispose();
      texture.dispose();
      grain.dispose();
      // Not forceContextLoss(): the same canvas must be able to start a fresh renderer (React dev mode re-runs effects,
      // and the paper is rebuilt when the screen width changes a lot).
      renderer.dispose();
    },
  };
}
