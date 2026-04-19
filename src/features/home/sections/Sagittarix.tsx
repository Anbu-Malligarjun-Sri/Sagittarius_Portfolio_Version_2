'use client';

import { useLayoutEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import type { HomeWindow } from '../gsapTypes';

export default function Sagittarix() {
  const containerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const w = window as HomeWindow;
    const gsap = w.gsap;
    if (!container || !gsap) return;

    const ctx = gsap.context(() => {
      gsap.from('.sx-card', {
        scrollTrigger: { trigger: container, start: 'top 65%' },
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-8 md:px-16 max-w-7xl mx-auto z-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
        <div>
          <div className="font-mono text-violet-400 text-xs tracking-widest mb-4 flex items-center gap-2"><BookOpen size={14} /> // SAGITTARIX INITIATIVE</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">AI for the next <br />generation of scientists.</h2>
        </div>
        <div className="max-w-md text-white/50 font-light mt-8 md:mt-0">SAGITTARIX is the STEM education arm-bringing AI, robotics, and physics to students through hands-on, problem-first learning frameworks.</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'AI Curriculum', desc: 'Open-source guides for ML and neural networks tailored for high school physics integration.' },
          { title: 'Robotics Kits', desc: 'TARS-lite blueprints and Raspberry Pi component lists for autonomous logic building.' },
          { title: 'Simulators', desc: 'Web-based astrophysics playgrounds connected to real time NASA APIs.' },
        ].map((item, i) => (
          <div key={i} className="sx-card glass-panel p-8 border-t-[3px] border-t-transparent hover:border-t-violet-500 transition-all duration-300 group">
            <h3 className="font-display font-bold text-xl mb-4 group-hover:text-violet-400 transition-colors">{item.title}</h3>
            <p className="font-mono text-xs text-white/50 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
