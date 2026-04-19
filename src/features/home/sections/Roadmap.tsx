'use client';

import { useLayoutEffect, useRef } from 'react';
import { CheckCircle2, Circle, CircleDashed } from 'lucide-react';
import type { HomeWindow } from '../gsapTypes';

type PhaseStatus = 'complete' | 'active' | 'future';

type Phase = {
  title: string;
  status: PhaseStatus;
  items: string[];
};

export default function Roadmap() {
  const containerRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    const w = window as HomeWindow;
    const gsap = w.gsap;
    if (!container || !line || !gsap) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: { trigger: container, start: 'top 50%', end: 'bottom 80%', scrub: 0.5 },
        },
      );

      gsap.from('.roadmap-item', {
        scrollTrigger: { trigger: container, start: 'top 60%' },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const phases: Phase[] = [
    { title: 'PHASE 0 - FOUNDATION', status: 'complete', items: ['Vision defined', 'Core architecture', 'Stack selected'] },
    { title: 'PHASE 1 - PROTOTYPE', status: 'active', items: ['SGR LLM M1 base', 'TARS voice module', 'Scientific AI alpha'] },
    { title: 'PHASE 2 - ALPHA BUILD', status: 'future', items: ['M2 reasoning module', 'Full TARS movement', 'External demo'] },
  ];

  return (
    <section id="roadmap" ref={containerRef} className="py-32 px-8 md:px-16 max-w-4xl mx-auto z-10 relative">
      <div className="text-center mb-20">
        <h2 className="font-display font-bold text-4xl mb-4">Trajectory.</h2>
        <p className="font-mono text-sm text-white/50">ESTIMATED COMPLETION: 2026</p>
      </div>

      <div className="relative pl-8 md:pl-0">
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />
        <div ref={lineRef} className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-cyan-400 md:-translate-x-1/2 shadow-[0_0_15px_#00E5FF]" />

        {phases.map((phase, i) => (
          <div key={i} className={`roadmap-item relative flex flex-col md:flex-row items-start md:items-center justify-between mb-16 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div
              className={`absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 top-0 md:top-auto w-3 h-3 rounded-full bg-void border-2 z-10 ${phase.status === 'complete' ? 'border-green-500 bg-green-500/20' : phase.status === 'active' ? 'border-orange-500 bg-orange-500 animate-pulse' : 'border-white/30'}`}
              style={{ borderColor: phase.status === 'complete' ? '#39FF14' : phase.status === 'active' ? '#FF8C00' : 'rgba(255,255,255,0.3)' }}
            />

            <div className={`w-full md:w-5/12 pt-6 md:pt-0 ${i % 2 !== 0 ? 'md:text-right' : ''}`}>
              <div className={`glass-panel p-6 border ${phase.status === 'active' ? 'border-orange-500/50 shadow-[0_0_20px_rgba(255,140,0,0.1)]' : 'border-white/10'}`}>
                <h3 className="font-mono text-sm font-bold text-white mb-4 tracking-wider">{phase.title}</h3>
                <ul className="space-y-2 font-mono text-xs text-white/60">
                  {phase.items.map((item, j) => (
                    <li key={j} className={`flex items-center gap-2 ${i % 2 !== 0 ? 'md:justify-end' : ''}`}>
                      {phase.status === 'complete' && <CheckCircle2 size={12} className="text-green-500" />}
                      {phase.status === 'active' && <CircleDashed size={12} className="text-orange-500 animate-spin-slow" />}
                      {phase.status === 'future' && <Circle size={12} className="text-white/30" />}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="hidden md:block w-5/12" />
          </div>
        ))}
      </div>
    </section>
  );
}
