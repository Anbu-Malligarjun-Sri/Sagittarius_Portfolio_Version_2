'use client';

import { useLayoutEffect, useRef } from 'react';
import type { HomeWindow } from '../gsapTypes';

export default function Mission() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const w = window as HomeWindow;
    const gsap = w.gsap;
    if (!section || !gsap) return;

    const ctx = gsap.context(() => {
      gsap.from('.mission-word', {
        scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 40%', scrub: 1 },
        z: 400,
        y: 100,
        opacity: 0,
        rotationX: -60,
        filter: 'blur(15px)',
        stagger: 0.1,
        ease: 'power2.out',
      });

      gsap.from('.mission-card', {
        scrollTrigger: { trigger: section, start: 'top 60%' },
        z: -300,
        y: 80,
        opacity: 0,
        rotationY: 30,
        filter: 'blur(10px)',
        stagger: 0.15,
        duration: 1.5,
        ease: 'expo.out',
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const headline = "We don't just build AI. We rebuild what was lost.";

  return (
    <section id="mission" ref={sectionRef} className="relative py-32 px-8 md:px-16 z-10 flex flex-col items-center text-center" style={{ perspective: '1200px' }}>
      <div className="font-mono text-cyan-400 text-xs tracking-widest mb-8">// CORE MISSION</div>
      <h2 className="font-display font-bold text-4xl md:text-6xl max-w-4xl leading-tight mb-12 transform-style-3d">
        {headline.split(' ').map((word, i) => (
          <span key={i} className="mission-word inline-block mr-[0.2em] transform-origin-bottom deep-scroll-item">{word}</span>
        ))}
      </h2>

      <p className="max-w-2xl text-lg text-white/50 mb-20 font-light">
        Sagittarius is the intersection of artificial intelligence, scientific computing, and the audacity to reverse extinction - one species, one algorithm at a time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl transform-style-3d">
        {[
          { title: 'DE-EXTINCTION', sub: 'Primary Goal', detail: 'Species Revival' },
          { title: 'INTELLIGENT MACHINES', sub: 'Autonomous', detail: 'Robotics' },
          { title: 'REAL-WORLD AI', sub: 'Vision + Voice', detail: 'Interaction' },
        ].map((card, i) => (
          <div key={i} className="mission-card deep-scroll-item glass-panel p-8 text-left transition-transform duration-700 hover:-translate-y-4 hover:scale-105 group">
            <h3 className="font-display font-bold text-xl mb-1 group-hover:text-cyan-400 transition-colors">{card.title}</h3>
            <p className="font-mono text-xs text-orange-400/80 mb-4">{card.sub}</p>
            <p className="text-white/40 text-sm">{card.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
