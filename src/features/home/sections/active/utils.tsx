import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function sectionHeadingClass() {
  return 'text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight';
}

export function glassCardClass(extra = '') {
  return `rounded-[6px] border border-white/10 bg-[rgba(255,255,255,0.04)] backdrop-blur-[20px] shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-all duration-300 ${extra}`;
}

export function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!active || hasPlayed.current) return;
    hasPlayed.current = true;

    const tween = { value: 0 };
    const animation = gsap.to(tween, {
      value: target,
      duration: 1.5,
      ease: 'power3.out',
      onUpdate: () => setValue(Math.round(tween.value)),
    });

    return () => {
      animation.kill();
    };
  }, [active, target]);

  return value;
}

// Gauge Component
export function Gauge({ label, value, display, active }: { label: string; value: number; display: string; active: boolean }) {
  const progress = useCountUp(value, active);
  const radius = 60;
  const circumference = Math.PI * radius;
  const filled = (progress / 100) * circumference;

  return (
    <div className="gauge-shell rounded-[8px] border border-white/10 bg-[#111111] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <svg viewBox="0 0 150 150" className="mx-auto block h-[150px] w-[150px]">
        <circle cx="75" cy="75" r={radius} stroke="#2a2a2a" strokeWidth="8" fill="none" strokeDasharray={`${circumference} ${circumference}`} transform="rotate(-180 75 75)" />
        <circle cx="75" cy="75" r={radius} stroke="#e8c547" strokeWidth="8" fill="none" strokeDasharray={`${filled} ${circumference}`} transform="rotate(-180 75 75)" strokeLinecap="round" />
        <circle cx="75" cy="75" r="49" stroke="rgba(232,93,36,0.3)" strokeWidth="8" fill="none" strokeDasharray={`${circumference * 0.2} ${circumference}`} transform="rotate(-180 75 75)" />
        {[...Array(18)].map((_, index) => {
          const angle = -180 + index * 10;
          const major = index % 3 === 0;
          const lineLength = major ? 12 : 6;
          const x1 = 75 + (radius - 6) * Math.cos((angle * Math.PI) / 180);
          const y1 = 75 + (radius - 6) * Math.sin((angle * Math.PI) / 180);
          const x2 = 75 + (radius - 6 - lineLength) * Math.cos((angle * Math.PI) / 180);
          const y2 = 75 + (radius - 6 - lineLength) * Math.sin((angle * Math.PI) / 180);
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={major ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'} strokeWidth={major ? 2 : 1} />;
        })}
        <g className="gauge-needle" transform={`rotate(${progress * 1.8 - 90} 75 75)`}>
          <line x1="75" y1="75" x2="75" y2="20" stroke="#e85d24" strokeWidth="2" strokeLinecap="round" />
          <circle cx="75" cy="75" r="4" fill="#e85d24" />
        </g>
      </svg>
      <div className="gauge-readout font-mono text-[28px] font-bold text-[#e8c547]">{display}</div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">{label}</div>
    </div>
  );
}

// Indicator Component
export function Indicator({ light, label, active, blinking = false }: { light: 'green' | 'amber' | 'off'; label: string; active?: boolean; blinking?: boolean }) {
  const base = light === 'green' ? '#2ecc71' : light === 'amber' ? '#e8c547' : '#2a2a2a';
  const shadow = light === 'green' ? '0 0 8px #2ecc71' : light === 'amber' ? '0 0 8px #e8c547' : 'none';

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${active && blinking ? 'animate-pulse' : ''}`}
        style={{ background: base, boxShadow: shadow }}
      />
      <span>{label}</span>
    </div>
  );
}

// Animated Count Component
export function AnimatedCount({ target, active }: { target: number; active: boolean }) {
  const value = useCountUp(target, active);
  return <span>{value}</span>;
}

// Split Flap Text Component
export function SplitFlapText({ text, active }: { text: string; active: boolean }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    let index = 0;
    const sequence = text.split('');
    const timer = window.setInterval(() => {
      setDisplay(
        sequence
          .map((char, current) => (current <= index ? char : chars[Math.floor(Math.random() * chars.length)]))
          .join(''),
      );
      index += 1;
      if (index > sequence.length + 2) {
        window.clearInterval(timer);
        setDisplay(text);
      }
    }, 45);

    return () => window.clearInterval(timer);
  }, [active, text]);

  return <span>{display}</span>;
}
