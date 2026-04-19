'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { HomeWindow } from './gsapTypes';

const SCENE_HEIGHT = 6500;
const CAMERA_HEIGHT = 1000;
const CAMERA_WIDTH = 2000;

const NEON_COLORS = ['#ff0055', '#00f0ff', '#8a2be2', '#00ff66', '#ffaa00'];

type SpinePoint = {
  x: number;
  y: number;
};

type BranchData = {
  id: string;
  path: string;
  startY: number;
  color: string;
};

type NodeData = {
  id: string;
  x: number;
  y: number;
  isSpine: boolean;
  scale: number;
  color: string;
  code?: string;
};

type ParticleData = {
  id: string;
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  opacity: number;
  isFront: boolean;
};

type NetworkData = {
  spinePath: string;
  branches: BranchData[];
  nodes: NodeData[];
  particles: ParticleData[];
};

type DNABackgroundProps = {
  gsapReady?: boolean;
};

const DNABackground = ({ gsapReady = false }: DNABackgroundProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const cameraRef = useRef<SVGGElement | null>(null);
  const spineRef = useRef<SVGPathElement | null>(null);
  const tetherRef = useRef<SVGLineElement | null>(null);
  const branchRefs = useRef<Array<SVGPathElement | null>>([]);
  const nodeOuterRefs = useRef<Array<SVGGElement | null>>([]);
  const nodeInnerRefs = useRef<Array<SVGCircleElement | null>>([]);
  const ringRefs = useRef<Array<SVGGElement | null>>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });

  const networkData = useMemo<NetworkData>(() => {
    const spinePoints: SpinePoint[] = [];
    let spineD = `M ${CAMERA_WIDTH / 2} 0`;

    for (let y = 0; y <= SCENE_HEIGHT; y += 80) {
      const x =
        CAMERA_WIDTH / 2 +
        Math.sin(y * 0.0012) * 400 +
        Math.cos(y * 0.003) * 150 +
        Math.sin(y * 0.007) * 50;

      spinePoints.push({ x, y });
      if (y > 0) spineD += ` L ${x} ${y}`;
    }

    const branches: BranchData[] = [];
    const nodes: NodeData[] = [];

    for (let y = 150; y < SCENE_HEIGHT - 300; y += 80 + Math.random() * 100) {
      const spinePoint = spinePoints.find((p) => p.y >= y) ?? spinePoints[0];
      const startX = spinePoint.x;
      const startY = y;

      const length = 200 + Math.random() * 500;
      const isRight = Math.random() > 0.5;
      const angleDeviation = (Math.random() * 70 + 10) * (Math.PI / 180);

      const endX = startX + (isRight ? 1 : -1) * Math.cos(angleDeviation) * length;
      const endY = startY + Math.sin(angleDeviation) * length + (Math.random() * 300 - 100);

      const cp1X = startX + (endX - startX) * 0.4;
      const cp1Y = startY + (Math.random() * 100 - 50);
      const cp2X = startX + (endX - startX) * 0.6;
      const cp2Y = endY - 100;

      const path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
      const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
      const code = `SYS.${Math.floor(Math.random() * 999)
        .toString()
        .padStart(3, '0')}`;

      branches.push({ id: `branch-${y}`, path, startY, color });
      nodes.push({ id: `node-s-${y}`, x: startX, y: startY, isSpine: true, scale: 0.8, color: '#ffffff' });
      nodes.push({ id: `node-e-${y}`, x: endX, y: endY, isSpine: false, scale: 1, color, code });
    }

    const particles = Array.from({ length: 200 }).map((_, i) => {
      const z = Math.random() * 4 - 2;
      return {
        id: `part-${i}`,
        x: Math.random() * CAMERA_WIDTH,
        y: Math.random() * SCENE_HEIGHT,
        z,
        size: Math.random() * 3 + 0.5,
        color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
        opacity: z > 0 ? 0.7 : 0.2,
        isFront: z > 0,
      };
    });

    return { spinePath: spineD, branches, nodes, particles };
  }, []);

  useEffect(() => {
    if (!gsapReady) return;
    const svg = svgRef.current;
    const w = window as HomeWindow;
    if (!svg || !w.gsap || !w.ScrollTrigger) return;

    const gsap = w.gsap;

    const ctx = gsap.context(() => {
      const maxScroll = SCENE_HEIGHT - CAMERA_HEIGHT;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });

      tl.to(cameraRef.current, { y: -maxScroll, ease: 'none', duration: 10 }, 0);
      tl.to('.particle-front', { y: -maxScroll * 1.5, ease: 'none', duration: 10 }, 0);
      tl.to('.particle-back', { y: -maxScroll * 0.6, ease: 'none', duration: 10 }, 0);

      const spineLen = spineRef.current?.getTotalLength() || 15000;
      gsap.set('.spine-layer', { strokeDasharray: spineLen });

      tl.fromTo(
        '.spine-layer',
        { strokeDashoffset: spineLen * 0.98 },
        { strokeDashoffset: -spineLen * 0.02, ease: 'none', duration: 10 },
        0,
      );

      branchRefs.current.forEach((branch, i) => {
        if (!branch) return;
        const len = branch.getTotalLength();
        gsap.set(branch, { strokeDasharray: len, strokeDashoffset: len });

        const branchData = networkData.branches[i];
        const startTime = Math.max(0, (branchData.startY - 400) / (maxScroll / 10));

        tl.to(
          branch,
          {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power3.inOut',
          },
          startTime,
        );
      });

      nodeOuterRefs.current.forEach((nodeGroup, i) => {
        if (!nodeGroup) return;
        const nodeData = networkData.nodes[i];
        const startTime = Math.max(0, (nodeData.y - 350) / (maxScroll / 10)) + (nodeData.isSpine ? 0 : 0.5);

        tl.fromTo(
          nodeGroup,
          { scale: 0, opacity: 0, rotation: -90 },
          { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
          startTime,
        );
      });

      gsap.to('.pulse-path', { strokeDashoffset: -2000, duration: 15, ease: 'none', repeat: -1 });
      gsap.to('.pulse-path-fast', { strokeDashoffset: 2000, duration: 8, ease: 'none', repeat: -1 });
      gsap.to(ringRefs.current, {
        rotation: 360,
        duration: 'random(10, 20)',
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      });
    }, svg);

    const onMouseMove = (event: MouseEvent) => {
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;

      const screenCTM = svg.getScreenCTM();
      if (!screenCTM) return;
      const cursorPt = point.matrixTransform(screenCTM.inverse());
      mousePos.current = { x: cursorPt.x, y: cursorPt.y };
    };

    const tether = tetherRef.current;
    if (!tether) {
      return () => {
        ctx.revert();
      };
    }

    const tracker = {
      tetherOpacity: gsap.quickTo(tether, 'opacity', { duration: 0.3 }),
    };

    const nodeAnimators = nodeInnerRefs.current.map((el) => ({
      scale: el ? gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'elastic.out(1, 0.3)' }) : null,
      glow: el ? gsap.quickTo(el, 'opacity', { duration: 0.3 }) : null,
    }));

    const updateInteractiveNodes = () => {
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      let closestNode: NodeData | null = null;
      let minDist = 300;

      for (let i = 0; i < networkData.nodes.length; i += 1) {
        const nodeData = networkData.nodes[i];
        const innerNode = nodeInnerRefs.current[i];
        const animator = nodeAnimators[i];
        if (!innerNode || !animator.scale || !animator.glow) continue;

        const dx = nodeData.x - mx;
        const dy = nodeData.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDist) {
          minDist = dist;
          closestNode = nodeData;
        }

        const hoverRadius = 250;
        if (dist < hoverRadius) {
          const intensity = 1 - dist / hoverRadius;
          animator.scale(nodeData.scale * (1 + intensity * 2));
          animator.glow(1);
          innerNode.setAttribute('filter', 'url(#bloomGlow)');
        } else {
          animator.scale(nodeData.scale);
          animator.glow(nodeData.isSpine ? 0.8 : 0.5);
          innerNode.removeAttribute('filter');
        }
      }

      if (closestNode && tetherRef.current) {
        tether.setAttribute('x1', `${closestNode.x}`);
        tether.setAttribute('y1', `${closestNode.y}`);
        tether.setAttribute('x2', `${mx}`);
        tether.setAttribute('y2', `${my}`);
        tracker.tetherOpacity(1 - minDist / 300);
        gsap.to(tether, { stroke: closestNode.color || '#00f0ff', duration: 0.3, overwrite: 'auto' });
      } else if (tetherRef.current) {
        tracker.tetherOpacity(0);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    gsap.ticker.add(updateInteractiveNodes);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(updateInteractiveNodes);
      ctx.revert();
    };
  }, [networkData, gsapReady]);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-violet-900/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed top-[40%] left-[40%] w-[30vw] h-[30vw] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${CAMERA_WIDTH} ${CAMERA_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full pointer-events-none"
      >
        <defs>
          <filter id="bloomGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur1" />
            <feGaussianBlur stdDeviation="12" result="blur2" />
            <feGaussianBlur stdDeviation="25" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="coreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff0055" stopOpacity="0.8" />
            <stop offset="33%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="66%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00ff66" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <g ref={cameraRef}>
          <g className="particle-back">
            {networkData.particles
              .filter((p) => !p.isFront)
              .map((p) => (
                <circle
                  key={p.id}
                  cx={p.x}
                  cy={p.y}
                  r={p.size}
                  fill={p.color}
                  opacity={p.opacity * 0.5}
                  filter="url(#bloomGlow)"
                />
              ))}
          </g>

          <g id="neural-graph">
            <g className="spine-layer" filter="url(#bloomGlow)">
              <path d={networkData.spinePath} stroke="url(#coreGradient)" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.15" />
              <path d={networkData.spinePath} stroke="url(#coreGradient)" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.5" />
              <path ref={spineRef} d={networkData.spinePath} stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9" />
            </g>

            <path
              className="pulse-path"
              d={networkData.spinePath}
              stroke="#ffffff"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="2 300"
              opacity="0.8"
              filter="url(#bloomGlow)"
              style={{ mixBlendMode: 'screen' }}
            />

            {networkData.branches.map((branch, i) => (
              <g key={branch.id}>
                <path d={branch.path} stroke={branch.color} strokeWidth="1" fill="none" opacity="0.1" />
                <path
                  ref={(el) => {
                    branchRefs.current[i] = el;
                  }}
                  d={branch.path}
                  stroke={branch.color}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#bloomGlow)"
                  opacity="0.85"
                />
                <path
                  className="pulse-path-fast"
                  d={branch.path}
                  stroke="#ffffff"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="8 250"
                  opacity="0.9"
                  filter="url(#bloomGlow)"
                />
              </g>
            ))}

            <line
              ref={tetherRef}
              x1="0"
              y1="0"
              x2="0"
              y2="0"
              stroke="#fff"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0"
              filter="url(#bloomGlow)"
              className="pointer-events-none mix-blend-screen"
            />

            {networkData.nodes.map((node, i) => (
              <g
                key={node.id}
                ref={(el) => {
                  nodeOuterRefs.current[i] = el;
                }}
                transform={`translate(${node.x}, ${node.y})`}
                className="opacity-0"
              >
                <g
                  ref={(el) => {
                    ringRefs.current[i] = el;
                  }}
                  opacity={node.isSpine ? 0.6 : 0.3}
                >
                  {node.isSpine ? (
                    <polygon points="0,-18 15.5,-9 15.5,9 0,18 -15.5,9 -15.5,-9" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
                  ) : (
                    <circle r="12" fill="none" stroke={node.color} strokeWidth="1" strokeDasharray="2 4" />
                  )}
                </g>

                <circle
                  ref={(el) => {
                    nodeInnerRefs.current[i] = el;
                  }}
                  r={node.isSpine ? 6 : 4}
                  fill={node.color}
                  className="origin-center cursor-crosshair transition-colors duration-300"
                />

                {node.isSpine && <circle r="2" fill="#ffffff" />}

                {!node.isSpine && (
                  <text
                    x="15"
                    y="4"
                    fill={node.color}
                    fontSize="10"
                    fontFamily="monospace"
                    letterSpacing="2"
                    opacity="0.7"
                    className="pointer-events-none select-none"
                  >
                    {node.code ?? ''}
                  </text>
                )}
              </g>
            ))}
          </g>

          <g className="particle-front">
            {networkData.particles
              .filter((p) => p.isFront)
              .map((p) => (
                <circle
                  key={p.id}
                  cx={p.x}
                  cy={p.y}
                  r={p.size}
                  fill={p.color}
                  opacity={p.opacity}
                  filter="url(#bloomGlow)"
                />
              ))}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default DNABackground;
