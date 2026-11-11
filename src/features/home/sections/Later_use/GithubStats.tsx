'use client';

import { useLayoutEffect, useRef } from 'react';
import { BookOpen, Code2, GitBranch, Star } from 'lucide-react';
import type { HomeWindow } from '../../gsapTypes';

export default function GithubStats() {
  const containerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const w = window as HomeWindow;
    const gsap = w.gsap;
    if (!container || !gsap) return;

    const ctx = gsap.context(() => {
      gsap.from('.gh-stat', {
        scrollTrigger: { trigger: container, start: 'top 75%' },
        textContent: 0,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        stagger: 0.1,
      });
      gsap.from('.gh-repo', {
        scrollTrigger: { trigger: container, start: 'top 65%' },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const repos = [
    { name: 'sagittariuz-core', desc: 'Core AI engine and M1 reasoning module implementations.', lang: 'Python', color: '#3572A5', stars: 124, forks: 12 },
    { name: 'tars-voice-os', desc: 'ROS-based conversational node for physical actuators.', lang: 'C++', color: '#f34b7d', stars: 89, forks: 8 },
    { name: 'astrophys-sim', desc: 'WebGL and WebGPU astrophysics simulation playground.', lang: 'TypeScript', color: '#3178c6', stars: 210, forks: 45 },
  ];

  return (
    <section id="lab" ref={containerRef} className="py-32 px-8 md:px-16 max-w-7xl mx-auto z-10 relative">
      <div className="text-center mb-16">
        <div className="font-mono text-cyan-400 text-xs tracking-widest mb-4 flex justify-center items-center gap-2"><Code2 size={14} /> OPEN SOURCE</div>
        <h2 className="font-display font-bold text-4xl mb-12">The Lab.</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 font-mono border border-white/10 rounded-full p-4 md:p-6 bg-white/5 backdrop-blur-sm max-w-2xl mx-auto">
          <div className="text-center"><div className="text-3xl text-white font-bold gh-stat">14</div><div className="text-[10px] text-white/40 mt-1 tracking-widest">REPOSITORIES</div></div>
          <div className="text-center"><div className="text-3xl text-white font-bold gh-stat">423</div><div className="text-[10px] text-white/40 mt-1 tracking-widest">STARS</div></div>
          <div className="text-center"><div className="text-3xl text-white font-bold gh-stat">1204</div><div className="text-[10px] text-white/40 mt-1 tracking-widest">COMMITS</div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {repos.map((repo, i) => (
          <div key={i} className="gh-repo glass-panel p-6 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
            <div>
              <h3 className="font-mono font-bold text-white mb-2 flex items-center gap-2"><BookOpen size={16} className="text-white/40" /> {repo.name}</h3>
              <p className="text-sm text-white/50 mb-6 font-light">{repo.desc}</p>
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.color }} /><span className="text-white/60">{repo.lang}</span></div>
              <div className="flex items-center gap-4 text-white/40"><span className="flex items-center gap-1"><Star size={12} /> {repo.stars}</span><span className="flex items-center gap-1"><GitBranch size={12} /> {repo.forks}</span></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
