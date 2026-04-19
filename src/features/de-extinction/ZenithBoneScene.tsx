'use client';

import { type MutableRefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

type ZenithBoneSceneProps = {
  scrollProgressRef?: MutableRefObject<number>;
  scrollVelocityRef?: MutableRefObject<number>;
};

type SpineUserData = {
  basePosition: THREE.Vector3;
  baseQuaternion: THREE.Quaternion;
  curveT: number;
  tangent: THREE.Vector3;
  baseScale: number;
  isDisc: boolean;
  currentRot: number;
  targetRot: number;
};

const ShaderLib = {
  noise3D: `
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0 );
      vec4 p = permute( permute( permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }
  `,
  curlNoise: `
    vec3 snoiseVec3( vec3 x ){
      float s  = snoise(vec3( x ));
      float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
      float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
      vec3 c = vec3( s , s1 , s2 );
      return c;
    }
    vec3 curlNoise( vec3 p ){
      const float e = .1;
      vec3 dx = vec3( e   , 0.0 , 0.0 );
      vec3 dy = vec3( 0.0 , e   , 0.0 );
      vec3 dz = vec3( 0.0 , 0.0 , e   );
      vec3 p_x0 = snoiseVec3( p - dx );
      vec3 p_x1 = snoiseVec3( p + dx );
      vec3 p_y0 = snoiseVec3( p - dy );
      vec3 p_y1 = snoiseVec3( p + dy );
      vec3 p_z0 = snoiseVec3( p - dz );
      vec3 p_z1 = snoiseVec3( p + dz );
      float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
      float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
      float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
      const float divisor = 1.0 / ( 2.0 * e );
      return normalize( vec3( x , y , z ) * divisor );
    }
  `,
  cinematicTear: {
    uniforms: {
      tDiffuse: { value: null },
      velocity: { value: 0.0 },
      time: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float velocity;
      uniform float time;
      varying vec2 vUv;

      void main() {
        vec2 fromCenter = vUv - 0.5;
        float dist = length(fromCenter);
        float tear = velocity * 0.015 * pow(dist, 2.0);
        vec2 offsetR = fromCenter * tear;
        vec2 offsetB = -fromCenter * tear;
        vec4 cr = texture2D(tDiffuse, vUv + offsetR);
        vec4 cga = texture2D(tDiffuse, vUv);
        vec4 cb = texture2D(tDiffuse, vUv + offsetB);
        gl_FragColor = vec4(cr.r, cga.g + (cb.b * tear * 10.0), cb.b + (cr.r * tear * 5.0), cga.a);
      }
    `,
  },
};

const LiquidDataShader = {
  uniforms: { time: { value: 0.0 } },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv; vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    ${ShaderLib.noise3D}

    void main() {
      float n1 = snoise(vec3(vUv.x * 25.0, vUv.y * 4.0, time * 2.5));
      float n2 = snoise(vec3(vUv.x * 40.0 - time*3.0, vUv.y * 15.0 + time*2.0, time * 2.0));

      float totalNoise = abs(n1) + abs(n2) * 0.5;

      vec3 color1 = vec3(0.0, 0.94, 1.0);
      vec3 color2 = vec3(0.44, 0.0, 0.88);
      vec3 color3 = vec3(1.0, 1.0, 1.0);

      vec3 finalColor = mix(color2, color1, smoothstep(0.2, 0.6, totalNoise));
      finalColor = mix(finalColor, color3, smoothstep(0.85, 1.0, totalNoise));

      gl_FragColor = vec4(finalColor * 4.0, 1.0);
    }
  `,
};

class LeviathanEngine {
  container: HTMLDivElement;
  scrollProgressRef?: MutableRefObject<number>;
  scrollVelocityRef?: MutableRefObject<number>;
  lastScrollProgress = 0;
  shockwave = 0;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  headLight!: THREE.PointLight;
  composer!: EffectComposer;
  bloomPass!: UnrealBloomPass;
  bokehPass!: BokehPass;
  tearPass!: ShaderPass;
  clock: THREE.Clock;

  curvePoints: THREE.Vector3[] = [];
  curve!: THREE.CatmullRomCurve3;
  spineGroup!: THREE.Group;
  spineBones: THREE.Object3D[] = [];

  envMap!: THREE.Texture;
  coreMaterial!: THREE.ShaderMaterial;
  boneUniforms?: { uTime: { value: number } };
  swarmMesh?: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;

  state = {
    mouse: new THREE.Vector2(0, 0),
    targetMouse: new THREE.Vector2(0, 0),
    mouseVelocity: 0,
    time: 0,
  };
  lastMouse = new THREE.Vector2(0, 0);

  constructor(
    container: HTMLDivElement,
    scrollProgressRef?: MutableRefObject<number>,
    scrollVelocityRef?: MutableRefObject<number>
  ) {
    this.container = container;
    this.scrollProgressRef = scrollProgressRef;
    this.scrollVelocityRef = scrollVelocityRef;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x010102, 0.0015);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    this.createAutomotiveEnvironment();
    this.buildLighting();
    this.buildTrajectory();
    this.buildPostProcessing();
    this.buildAnatomicalSpine();
    this.buildLiquidCore();
    this.buildGPUFluidSwarm();

    this.bindEvents();
  }

  createAutomotiveEnvironment() {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x000000);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const palette = [0x00e5ff, 0xff0055, 0xffaa00];

      const strip = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 1000),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(palette[i % 3]), side: THREE.DoubleSide })
      );

      const radius = 300;
      strip.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      strip.lookAt(0, 0, 0);
      envScene.add(strip);
    }

    const envCamera = new THREE.CubeCamera(0.1, 1000, new THREE.WebGLCubeRenderTarget(1024));
    envCamera.position.set(0, 0, 0);
    envCamera.update(this.renderer, envScene);
    this.envMap = envCamera.renderTarget.texture;
  }

  buildPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8,
      0.5,
      0.2
    );
    this.composer.addPass(this.bloomPass);

    this.bokehPass = new BokehPass(this.scene, this.camera, {
      focus: 10.0,
      aperture: 0.00003,
      maxblur: 0.03,
    });
    this.composer.addPass(this.bokehPass);

    this.tearPass = new ShaderPass(ShaderLib.cinematicTear);
    this.composer.addPass(this.tearPass);
  }

  buildLighting() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.05));

    const dir1 = new THREE.DirectionalLight(0x00e5ff, 5);
    dir1.position.set(400, 200, 300);
    this.scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0x8c00ff, 5);
    dir2.position.set(-400, -200, -300);
    this.scene.add(dir2);

    this.headLight = new THREE.PointLight(0xffffff, 8, 400);
    this.camera.add(this.headLight);
    this.scene.add(this.camera);
  }

  buildTrajectory() {
    for (let i = 0; i <= 400; i++) {
      const t = i / 400;
      const y = (0.5 - t) * 5000;

      const primaryAngle = t * Math.PI * 5;
      const radius = 40 + Math.sin(t * Math.PI * 8) * 30;

      const x = Math.cos(primaryAngle) * radius + Math.sin(t * Math.PI * 2) * 20;
      const z = Math.sin(primaryAngle) * radius + Math.cos(t * Math.PI * 3) * 20;

      this.curvePoints.push(new THREE.Vector3(x, y, z));
    }
    this.curve = new THREE.CatmullRomCurve3(this.curvePoints);
    this.curve.tension = 0.5;
  }

  buildAnatomicalSpine() {
    this.spineGroup = new THREE.Group();
    this.scene.add(this.spineGroup);

    const bodyPoints: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const v = i / 12;
      const radius = 7.5 - Math.sin(v * Math.PI) * 1.8;
      bodyPoints.push(new THREE.Vector2(radius, (v - 0.5) * 4.5));
    }
    const centrumGeo = new THREE.LatheGeometry(bodyPoints, 64);
    centrumGeo.rotateX(Math.PI / 2);

    const archShape = new THREE.Shape();
    const res = 250;
    let started = false;
    for (let i = 0; i <= res; i++) {
      const theta = (i / res) * Math.PI * 2;
      if (theta > Math.PI * 0.75 && theta < Math.PI * 2.25) {
        const spinous = 38.0 * Math.pow((-Math.sin(theta) + 1.0) / 2.0, 40.0);
        const transverse = 22.0 * Math.pow(Math.cos(theta), 16.0);
        const r = 4.2 + spinous + transverse;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        if (!started) {
          archShape.moveTo(x, y);
          started = true;
        } else {
          archShape.lineTo(x, y);
        }
      }
    }

    const archGeo = new THREE.ExtrudeGeometry(archShape, {
      depth: 2.2,
      bevelEnabled: true,
      bevelSegments: 16,
      steps: 1,
      bevelSize: 1.0,
      bevelThickness: 1.0,
    });
    archGeo.center();

    const boneMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x010101,
      metalness: 1.0,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      transmission: 0.95,
      thickness: 15.0,
      ior: 2.5,
      envMap: this.envMap,
      envMapIntensity: 2.5,
      side: THREE.DoubleSide,
    });

    const sharedUniforms = { uTime: { value: 0 } };
    this.boneUniforms = sharedUniforms;

    boneMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = sharedUniforms.uTime;
      shader.vertexShader = `
        uniform float uTime;
        ${ShaderLib.noise3D}
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `
          #include <begin_vertex>
          vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          float macro = snoise(worldPos * 0.05 + uTime * 0.1) * 1.5;
          float micro = snoise(worldPos * 0.5) * 0.2;
          transformed += normal * (macro + micro);
        `
      );
    };

    const discGeo = new THREE.CylinderGeometry(7.5, 7.5, 1.8, 64);
    discGeo.rotateX(Math.PI / 2);

    const discMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.35,
      transmission: 0.6,
      opacity: 0.95,
      transparent: true,
      roughness: 0.2,
    });

    const axis = new THREE.Vector3(0, 0, 1);
    const numBones = 160;

    for (let i = 0; i <= numBones; i++) {
      const t = i / numBones;
      const point = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();
      const boneQuat = new THREE.Quaternion().setFromUnitVectors(axis, tangent);
      const scale = 0.5 + Math.pow(Math.sin(t * Math.PI), 1.8) * 0.8;

      const vertebraGroup = new THREE.Group();
      const centrum = new THREE.Mesh(centrumGeo, boneMaterial);
      const arch = new THREE.Mesh(archGeo, boneMaterial);
      arch.position.y = 2.0;
      vertebraGroup.add(centrum);
      vertebraGroup.add(arch);

      vertebraGroup.userData = {
        basePosition: point,
        baseQuaternion: boneQuat,
        curveT: t,
        tangent,
        baseScale: scale,
        isDisc: false,
        currentRot: 0,
        targetRot: 0,
      } satisfies SpineUserData;

      vertebraGroup.position.copy(point);
      vertebraGroup.quaternion.copy(boneQuat);
      vertebraGroup.scale.setScalar(scale);

      this.spineBones.push(vertebraGroup);
      this.spineGroup.add(vertebraGroup);

      if (i < numBones) {
        const discT = t + (0.5 / numBones);
        const discPoint = this.curve.getPointAt(discT);
        const discTangent = this.curve.getTangentAt(discT).normalize();
        const discQuat = new THREE.Quaternion().setFromUnitVectors(axis, discTangent);

        const disc = new THREE.Mesh(discGeo, discMaterial.clone());
        disc.userData = {
          basePosition: discPoint,
          baseQuaternion: discQuat,
          curveT: discT,
          tangent: discTangent,
          baseScale: scale,
          isDisc: true,
          currentRot: 0,
          targetRot: 0,
        } satisfies SpineUserData;
        disc.position.copy(discPoint);
        disc.quaternion.copy(discQuat);
        disc.scale.setScalar(scale);

        this.spineBones.push(disc);
        this.spineGroup.add(disc);
      }
    }
  }

  buildLiquidCore() {
    const tubeGeo = new THREE.TubeGeometry(this.curve, 1000, 2.0, 32, false);
    this.coreMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(LiquidDataShader.uniforms),
      vertexShader: LiquidDataShader.vertexShader,
      fragmentShader: LiquidDataShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.spineGroup.add(new THREE.Mesh(tubeGeo, this.coreMaterial));
  }

  buildGPUFluidSwarm() {
    const particleCount = 100000;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const t = Math.random();
      const point = this.curve.getPointAt(t);
      const radius = 20 + Math.random() * 300;
      const angle = Math.random() * Math.PI * 2;

      positions[i3] = point.x + Math.cos(angle) * radius;
      positions[i3 + 1] = point.y + (Math.random() - 0.5) * 500;
      positions[i3 + 2] = point.z + Math.sin(angle) * radius;

      randoms[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    const swarmMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uVelocity: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform float uVelocity;
        attribute float aRandom;
        ${ShaderLib.noise3D}
        ${ShaderLib.curlNoise}
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          vec3 curlVelocity = curlNoise(pos * 0.01 + uTime * 0.05);
          pos += curlVelocity * 20.0 * aRandom;
          pos.y += uScroll * 4000.0;
          pos.y = mod(pos.y + 2500.0, 5000.0) - 2500.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (12.0 * aRandom) * (1.0 / -mvPosition.z);
          gl_PointSize += uVelocity * 0.5 * aRandom;
          vAlpha = smoothstep(2000.0, 100.0, -mvPosition.z) * 0.5;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          gl_FragColor = vec4(0.0, 0.9, 1.0, vAlpha * (1.0 - (ll * 2.0)));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.swarmMesh = new THREE.Points(geometry, swarmMat);
    this.scene.add(this.swarmMesh);
  }

  bindEvents() {
    const onMove = (e: MouseEvent) => {
      this.state.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.state.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.composer.setSize(window.innerWidth, window.innerHeight);
      this.bokehPass.setSize(window.innerWidth, window.innerHeight);
      const bokehUniforms = this.bokehPass.uniforms as Record<string, { value: number }>;
      bokehUniforms['aspect'].value = this.camera.aspect;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);

    this._cleanup = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }

  _cleanup?: () => void;

  getScrollState() {
    if (this.scrollProgressRef) {
      return {
        progress: this.scrollProgressRef.current,
        velocity: this.scrollVelocityRef?.current ?? 0,
      };
    }

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = window.scrollY / maxScroll;
    const velocity = progress - this.lastScrollProgress;
    this.lastScrollProgress = progress;
    return { progress, velocity };
  }

  animate = () => {
    const time = this.clock.getElapsedTime();
    this.state.time = time;

    const s = this.state;

    s.mouse.x += (s.targetMouse.x - s.mouse.x) * 0.05;
    s.mouse.y += (s.targetMouse.y - s.mouse.y) * 0.05;

    const vX = Math.abs(s.targetMouse.x - this.lastMouse.x);
    const vY = Math.abs(s.targetMouse.y - this.lastMouse.y);
    s.mouseVelocity += ((vX + vY) - s.mouseVelocity) * 0.1;
    this.lastMouse.copy(s.targetMouse);

    const { progress: scrollProgress, velocity: scrollVel } = this.getScrollState();

    this.shockwave += scrollVel * 0.1;
    this.shockwave *= 0.92;

    if (this.boneUniforms) this.boneUniforms.uTime.value = time;

    this.spineGroup.rotation.y = time * 0.04;
    const upVector = new THREE.Vector3(0, 1, 0);
    const globalTorsion = scrollProgress * Math.PI * 10.0;

    for (let i = 0; i < this.spineBones.length; i++) {
      const obj = this.spineBones[i];
      const data = obj.userData as SpineUserData;

      const rightVector = new THREE.Vector3().crossVectors(data.tangent, upVector).normalize();
      const wave1 = Math.sin(time * 2.5 + data.curveT * 18.0);
      const wave2 = Math.cos(time * 1.5 + data.curveT * 10.0);
      const slitherOffset = (wave1 + wave2) * 15.0 * Math.sin(data.curveT * Math.PI);

      obj.position.copy(data.basePosition);
      obj.position.addScaledVector(rightVector, slitherOffset);
      obj.quaternion.copy(data.baseQuaternion);

      const phaseDelay = data.curveT * Math.PI * 16.0;
      data.targetRot = phaseDelay + (time * 0.3) + globalTorsion;
      data.currentRot += (data.targetRot - data.currentRot) * 0.12;
      obj.rotateZ(data.currentRot);

      const localShock = Math.max(0, this.shockwave - (data.curveT * 1.5));

      if (data.isDisc && obj instanceof THREE.Mesh) {
        const pulse = 1.0 + Math.pow(Math.sin(time * 5.0 + data.curveT * 25.0), 2) * 0.15 + (localShock * 0.05);
        obj.scale.set(data.baseScale * pulse, data.baseScale, data.baseScale * pulse);
        const mat = obj.material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.35 + (pulse * 0.6) + (localShock * 0.8);
      } else {
        const flare = 1.0 + Math.pow(Math.sin(time * 2.5 + data.curveT * 15.0), 2) * 0.08 + (localShock * 0.02);
        obj.scale.set(data.baseScale * flare, data.baseScale, data.baseScale * flare);
      }
    }

    if (this.coreMaterial) {
      this.coreMaterial.uniforms.time.value = time + (scrollProgress * 25.0) + this.shockwave;
    }

    if (this.swarmMesh) {
      const swarmMat = this.swarmMesh.material as THREE.ShaderMaterial;
      swarmMat.uniforms.uTime.value = time;
      swarmMat.uniforms.uScroll.value = scrollProgress;
      swarmMat.uniforms.uVelocity.value = scrollVel;
    }

    const camT = Math.max(0.01, Math.min(0.97, scrollProgress));
    const targetPos = this.curve.getPointAt(camT);
    const lookT = Math.min(1.0, camT + 0.03);
    const lookPos = this.curve.getPointAt(lookT);

    const swirlAngle = scrollProgress * Math.PI * 8.0;
    const activeOrbit = swirlAngle + (time * 0.08) + (s.mouse.x * 1.5);

    const scrollBulge = Math.sin(scrollProgress * Math.PI) * 70;
    const cameraDistance = 140 + scrollBulge + (s.mouse.y * 30);

    this.camera.position.x = targetPos.x + Math.cos(activeOrbit) * cameraDistance;
    this.camera.position.z = targetPos.z + Math.sin(activeOrbit) * cameraDistance;
    this.camera.position.y = targetPos.y + 80;

    this.camera.lookAt(lookPos);

    const shake = this.shockwave * 0.005 * Math.sin(time * 50.0);
    this.camera.rotation.z += Math.sin(time * 0.15) * 0.15 + (s.mouse.x * 0.3) + (scrollVel * 1.5) + shake;

    if (this.tearPass) {
      this.tearPass.uniforms['velocity'].value = scrollVel;
      this.tearPass.uniforms['time'].value = time;
    }

    if (this.bokehPass) {
      const focusDist = this.camera.position.distanceTo(targetPos);
      const bokehUniforms = this.bokehPass.uniforms as Record<string, { value: number }>;
      bokehUniforms['focus'].value = focusDist + 20;
    }

    this.bloomPass.strength = 0.8 + Math.abs(scrollVel) * 1.5;

    this.composer.render();
    this._raf = requestAnimationFrame(this.animate);
  };

  _raf = 0;

  start() {
    this.animate();
  }

  dispose() {
    cancelAnimationFrame(this._raf);
    this._cleanup?.();

    this.spineBones.forEach((obj) => {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });

    if (this.swarmMesh) {
      this.swarmMesh.geometry.dispose();
      (this.swarmMesh.material as THREE.Material).dispose();
    }

    if (this.coreMaterial) {
      this.coreMaterial.dispose();
    }

    this.envMap?.dispose();
    this.composer?.dispose();
    this.renderer?.dispose();

    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

const ZenithBoneScene = ({ scrollProgressRef, scrollVelocityRef }: ZenithBoneSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = containerRef.current;
    if (!mount) return;

    const engine = new LeviathanEngine(mount, scrollProgressRef, scrollVelocityRef);
    engine.start();

    return () => {
      engine.dispose();
    };
  }, [scrollProgressRef, scrollVelocityRef]);

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default ZenithBoneScene;
