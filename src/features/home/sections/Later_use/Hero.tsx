'use client';

import { useLayoutEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTypewriter } from '../../hooks';
import type { HomeWindow } from '../../gsapTypes';

export default function Hero() {
  const containerRef = useRef<HTMLElement | null>(null);
  const typeLines = [
    '> DE-EXTINCTION PROTOCOL ACTIVE',
    '> SAGITTARIUZ LLM [M1/M2] ONLINE',
    '> TARS ROBOTICS SYSTEM BOOTING…',
    '> SPECIES REVIVAL IN PROGRESS',
  ];
  const typedText = useTypewriter(typeLines, 60, 2500);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const w = window as HomeWindow;
    const gsap = w.gsap;
    if (!container || !gsap) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from('.hero-anim', {
        z: -500,
        y: 100,
        rotationX: 15,
        opacity: 0,
        filter: 'blur(20px)',
        stagger: 0.2,
        duration: 1.8,
        ease: 'expo.out',
        delay: 0.2,
      });

      gsap.to('.scroll-indicator', {
        y: 15,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'power1.inOut',
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 pt-20" style={{ perspective: '1200px' }}>
      <div className="max-w-4xl z-10 transform-style-3d">
        <div className="hero-anim flex items-center gap-3 font-mono text-xs text-cyan-400 mb-6 deep-scroll-item">
          <div className="w-4 h-px bg-cyan-400" />
          <span>// ADV. AI + ROBOTICS INITIATIVE</span>
        </div>

        <h1 className="hero-anim font-display font-black text-6xl md:text-[7rem] leading-[0.9] tracking-tighter mb-6 text-white uppercase deep-scroll-item" data-text="SAGITTARIUZ">
          <span className="glitch-text block" data-text="SAGIT">SAGIT</span>
          <span className="glitch-text block" data-text="TARIUS">TARIUS</span>
        </h1>

        <div className="hero-anim w-0 h-1 bg-linear-to-r from-orange-500 to-transparent mb-8 deep-scroll-item" style={{ width: '200px' }} />

        <div className="hero-anim h-8 font-mono text-sm md:text-base text-white/80 mb-12 glass-panel py-2 px-4 inline-block deep-scroll-item">
          {typedText}
          <span className="animate-pulse">_</span>
        </div>

        <div className="hero-anim flex flex-wrap gap-4 font-mono text-xs deep-scroll-item">
          {['De-Extinction', 'Sagittariuz LLM', 'Robotics', 'Astrophysics AI'].map((badge) => (
            <span key={badge} className="px-4 py-2 glass-panel rounded-full text-white/80 hover:text-cyan-400 transition-colors">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator z-10 opacity-50">
        <span className="font-mono text-[10px] tracking-[0.2em]">DEEP SCROLL</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
}
