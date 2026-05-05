'use client';

import { useState, useEffect, useRef, useCallback, type MouseEvent } from 'react';

type ObserverOptions = IntersectionObserverInit;

type CipherLineProps = {
  text: string;
  delay: number;
  onComplete?: () => void;
  isCommand?: boolean;
  isError?: boolean;
  isSystem?: boolean;
};

type TerminalProps = {
  hasStarted: boolean;
};

type TerminalLine = {
  text: string;
  type: 'system' | 'command' | 'output' | 'error';
  delay: number;
};

const useIntersectionObserver = (options?: ObserverOptions) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const threshold = options?.threshold ?? 0.2;
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '0px';
  const thresholdKey = Array.isArray(threshold) ? threshold.join(',') : `${threshold}`;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [thresholdKey, root, rootMargin]);

  return [elementRef, isIntersecting] as const;
};

const CipherLine = ({ text, delay, onComplete, isCommand, isError, isSystem }: CipherLineProps) => {
  const [displayText, setDisplayText] = useState('');

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    timeoutId = setTimeout(() => {
      let iteration = 0;
      intervalId = setInterval(() => {
        const newText = text
          .split('')
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        setDisplayText(newText);

        if (iteration >= text.length) {
          clearInterval(intervalId);
          if (onComplete) onComplete();
        }

        iteration += 1 / 3;
      }, 20);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, delay, onComplete]);

  if (!displayText) return null;

  let colorClass = 'text-cyan-300';
  if (isCommand) colorClass = 'text-orange-400';
  if (isError) colorClass = 'text-red-400';
  if (isSystem) colorClass = 'text-green-400 font-bold';

  return (
    <div className={`font-mono text-sm tracking-wide ${colorClass} mb-1 flex`}>
      {isCommand && <span className="mr-2 text-white/50">❯</span>}
      <span>{displayText}</span>
    </div>
  );
};

const Terminal = ({ hasStarted }: TerminalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const lines: TerminalLine[] = [
    { text: 'INITIATING NEURAL BOOT SEQUENCE...', type: 'system', delay: 100 },
    { text: 'connect --host sagittarius-core', type: 'command', delay: 400 },
    { text: 'ESTABLISHING QUANTUM LINK [||||||||||] 100%', type: 'output', delay: 200 },
    { text: 'whoami', type: 'command', delay: 500 },
    { text: 'USER: [founder]@sagittarius', type: 'output', delay: 200 },
    { text: 'status: ACTIVE_BUILDER', type: 'output', delay: 100 },
    { text: 'focus: AI + Robotics Engineering', type: 'output', delay: 100 },
    { text: 'stack: Python | ML | NLP | Vision | C++', type: 'output', delay: 100 },
    { text: 'goal: De-extinction via Generative Systems', type: 'output', delay: 100 },
    { text: '[●●●] ALL SYSTEMS NOMINAL. AWAITING INPUT.', type: 'system', delay: 800 },
  ];

  useEffect(() => {
    if (hasStarted) setCurrentStep(0);
  }, [hasStarted]);

  return (
    <div className="relative w-full h-full overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%] z-10 opacity-50 scanline-animation" />
      <div className="absolute inset-0 bg-cyan-900/10 blur-[50px] pointer-events-none" />

      <div
        className="relative z-20 h-64 overflow-y-auto terminal-scrollbar scroll-smooth"
        role="log"
        aria-live="polite"
        aria-label="System terminal output"
      >
        {hasStarted &&
          lines.map((line, index) => {
            if (index > currentStep) return null;
            return (
              <CipherLine
                key={index}
                text={line.text}
                delay={line.delay}
                isCommand={line.type === 'command'}
                isSystem={line.type === 'system'}
                isError={line.type === 'error'}
                onComplete={() => {
                  if (index === currentStep && index < lines.length - 1) {
                    setCurrentStep((prev) => prev + 1);
                  }
                }}
              />
            );
          })}

        {hasStarted && currentStep >= lines.length - 1 && (
          <div className="mt-2 flex">
            <span className="mr-2 text-white/50 font-mono text-sm">❯</span>
            <span className="animate-pulse bg-cyan-400/80 w-2 h-4 inline-block align-middle shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default function FounderTerminal() {
  const [sectionRef, isVisible] = useIntersectionObserver();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    const overlay = card.querySelector('.glare-overlay') as HTMLDivElement | null;
    if (overlay) {
      overlay.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

    const overlay = card.querySelector('.glare-overlay') as HTMLDivElement | null;
    if (overlay) overlay.style.background = 'none';
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.1s ease-out';
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen py-32 px-6 md:px-16 max-w-7xl mx-auto z-10 relative flex flex-col lg:flex-row gap-20 items-center justify-center">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .scanline-animation {
          animation: scanline 8s linear infinite;
        }
        .terminal-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .terminal-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.2);
          border-radius: 4px;
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.4);
        }
      `}</style>

      <div className="flex-1 space-y-8 w-full">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-mono text-orange-400 text-xs tracking-widest font-medium">// FOUNDER // ARCHITECT</span>
          </div>

          <h2 className="font-sans font-bold text-5xl md:text-6xl leading-tight text-transparent bg-clip-text bg-linear-to-r from-white to-white/60 mb-6">
            Building the Future,
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">Line by Line.</span>
          </h2>
        </div>

        <div className={`text-slate-400 space-y-6 font-light text-lg md:text-xl leading-relaxed transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="border-l-2 border-cyan-500/50 pl-4">
            I'm a CS student obsessed with one question:
            <br />
            <strong className="font-medium text-slate-200">What if AI could fix what nature lost?</strong>
          </p>
          <p>
            Sagittarius was born from that obsession - merging artificial intelligence, precision robotics, and bio-informatics into systems that don't just compute, but <em className="text-cyan-300 font-medium not-italic">think</em>.
          </p>
        </div>

        <div className={`flex flex-wrap gap-3 pt-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {['AI / ML', 'Robotics', 'Quantum Computing', 'Computer Vision', 'De-extinction'].map((tag) => (
            <span key={tag} className="px-5 py-2.5 border border-white/5 rounded-full text-xs font-mono bg-white/5 backdrop-blur-md hover:bg-cyan-500/10 hover:border-cyan-400/50 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300 cursor-default">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={`flex-1 w-full max-w-xl transition-all duration-1000 transform perspective-[1000px] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          className="group relative rounded-xl bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-cyan-900/20 overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="glare-overlay pointer-events-none absolute inset-0 z-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100 mix-blend-overlay" />

          <div className="bg-slate-900/90 px-4 py-3 flex items-center justify-between border-b border-white/5 relative z-30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
            </div>
            <div className="font-mono text-[11px] text-slate-500 tracking-wider flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              sagittarius-os v0.9.1
            </div>
          </div>

          <Terminal hasStarted={isVisible} />
          <div className="absolute inset-0 border border-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-screen" />
        </div>
      </div>
    </section>
  );
}
