'use client';

import { useLayoutEffect, useRef, type MouseEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import type { HomeWindow } from '../../gsapTypes';

export default function Products() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const w = window as HomeWindow;
    const gsap = w.gsap;
    const root = containerRef.current;
    if (!root || !gsap) return;

    const cards = root.querySelectorAll<HTMLElement>('.prod-card');
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 });

      gsap.from(cards, {
        scrollTrigger: {
          trigger: root,
          start: 'top 80%',
          once: true,
        },
        y: 60,
        autoAlpha: 0,
        scale: 0.96,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        immediateRender: false,
      });

      gsap.to(cards, {
        y: '+=10',
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: 'sine.inOut',
        stagger: 0.2,
      });
    }, root);

    return () => {
      ctx.revert();
      cards.forEach((card) => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
      });
    };
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 20;
    const rotateY = (x - centerX) / 20;

    const w = window as HomeWindow;
    const gsap = w.gsap;
    if (!gsap) return;

    gsap.to(el, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      duration: 0.4,
      ease: 'power2.out',
    });

    const glow = el.querySelector<HTMLElement>('.glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,140,0,0.25), transparent 40%)`;
    }
  };

  const resetTilt = (el: HTMLDivElement) => {
    const w = window as HomeWindow;
    const gsap = w.gsap;
    if (!gsap) return;

    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
  };

  const products = [
    { id: '01', name: 'TARS ROBOT', desc: 'Voice · Movement · AI Conscious Interface.', status: 'PROTOTYPE', href: '#mission' },
    { id: '02', name: 'SAGITTARIUZ LLM', desc: 'RAG · Vector DB · Neural Memory Systems.', status: 'ACTIVE', href: '#llm' },
    { id: '03', name: 'EDITH SMART GLASS', desc: 'AR Vision · Real-time Cognition · Voice.', status: 'IN DEV', href: '#tech' },
    { id: '04', name: 'SCIENTIFIC AI', desc: 'Astrophysics · Quantum Simulations Engine.', status: 'CONCEPT', href: '#roadmap' },
  ];

  return (
    <section
      id="products"
      ref={containerRef}
      className="py-32 px-8 md:px-16 max-w-7xl mx-auto z-10 relative"
    >
      {/* HEADER */}
      <div className="mb-20 flex justify-between items-end">
        <div>
          <div className="font-mono text-cyan-400 text-xs tracking-widest mb-4">
            {"// INITIATIVES"}
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight">
            Hardware & Cognition
          </h2>
        </div>
        <div className="hidden md:block text-right text-white/40 font-mono text-xs">
          [ 4 ACTIVE PROJECTS ]
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-distant">
        {products.map((p, i) => (
          <div
            key={i}
            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
            onMouseLeave={(e) => resetTilt(e.currentTarget)}
            className="prod-card group relative p-8 min-h-65 flex flex-col justify-between rounded-2xl border border-white/10 bg-white/2 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-orange-500/40"
          >
            {/* Glow layer */}
            <div className="glow absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

            {/* BIG NUMBER */}
            <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/3 group-hover:text-orange-500/10 transition-all duration-700">
              {p.id}
            </div>

            {/* CONTENT */}
            <div>
              <div className="inline-block px-2 py-1 bg-white/5 border border-white/10 text-[10px] font-mono mb-4 text-cyan-400">
                STATUS: {p.status}
              </div>
              <h3 className="font-display font-bold text-2xl mb-3 group-hover:text-orange-400 transition-colors duration-300">
                {p.name}
              </h3>
              <p className="text-white/50 text-sm font-mono max-w-[85%] leading-relaxed">
                {p.desc}
              </p>
            </div>

            {/* FOOTER */}
            <a href={p.href} className="mt-10 inline-flex items-center font-mono text-xs tracking-widest transition-all duration-300 group-hover:translate-x-3">
              <span className="text-white/70 group-hover:text-white">
                EXPLORE ARCHITECTURE
              </span>
              <ArrowRight
                size={14}
                className="ml-2 text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
              />
            </a>

            {/* BORDER GLOW */}
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-orange-500/30 group-hover:shadow-[0_0_40px_rgba(255,115,0,0.15)] transition-all duration-500 pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}
