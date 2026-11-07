'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FOUNDERS } from './founders';
import styles from './team.module.css';

const SHORT_ROLE: Record<string, string> = { anbu: 'CEO', brajin: 'CTO', arun: 'COO' };

/** Portrait on a flat colour field. Cycles through the founders; hover or the dots pause it. */
export default function HeroPortrait() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % FOUNDERS.length), 3800);
    return () => window.clearInterval(timer);
  }, [paused]);

  const active = FOUNDERS[index];

  return (
    <div
      data-assemble=""
      data-from="right"
      className="relative mx-auto w-full max-w-[420px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 translate-x-3 translate-y-3 border border-[#ff3b3b]/60" />
      <div className={`${styles.field} relative aspect-[4/5] w-full overflow-hidden`} style={{ backgroundColor: active.field }}>
        {FOUNDERS.map((founder, i) => (
          <Image
            key={founder.id}
            src={founder.photo}
            alt={i === index ? `Portrait of ${founder.name}` : ''}
            aria-hidden={i !== index}
            fill
            sizes="(max-width: 1024px) 80vw, 420px"
            preload={i === 0}
            className={`${styles.shot} object-cover object-top ${founder.medium === 'ink' ? 'mix-blend-multiply' : ''}`}
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
        <span className="absolute right-3 top-3 font-mono text-[10px] tracking-[0.25em] text-white/80">#SYS-0{index + 1}</span>
      </div>

      <p className="absolute -bottom-3 left-3 z-10 flex items-center gap-2 border border-[#ff3b3b]/60 bg-[#060608]/90 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff3b3b] backdrop-blur">
        <span className={`${styles.liveDot} h-1.5 w-1.5 rounded-full bg-[#ff3b3b]`} />
        {active.name.split(' ')[0]} — {SHORT_ROLE[active.id]} active
      </p>

      <div className="mt-8 flex justify-center gap-2">
        {FOUNDERS.map((founder, i) => (
          <button
            key={founder.id}
            type="button"
            aria-label={`Show ${founder.name}`}
            onClick={() => {
              setIndex(i);
              setPaused(true);
            }}
            className={`h-1.5 transition-all duration-300 ${i === index ? 'w-8 bg-[#ff3b3b]' : 'w-3 bg-white/25'}`}
          />
        ))}
      </div>
    </div>
  );
}
