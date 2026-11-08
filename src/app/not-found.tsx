import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page is not here.',
};

// The archer's mark: a target with an arrow that landed just outside it.
function MissedShot() {
  return (
    <svg viewBox="0 0 320 140" className="mx-auto w-full max-w-[320px]" role="img" aria-label="An arrow that missed its target">
      <style>{`
        @keyframes fly { from { transform: translateX(-60px); opacity: 0; } 60% { opacity: 1; } to { transform: translateX(0); opacity: 1; } }
        @keyframes settle { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-2.5deg); } }
        .arrow { animation: fly 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .shaft { transform-origin: 250px 98px; animation: settle 3.2s ease-in-out 1s infinite; }
        @media (prefers-reduced-motion: reduce) { .arrow, .shaft { animation: none; } }
      `}</style>
      <g fill="none" stroke="#e8c547">
        <circle cx="70" cy="70" r="54" strokeOpacity="0.25" />
        <circle cx="70" cy="70" r="36" strokeOpacity="0.4" />
        <circle cx="70" cy="70" r="18" strokeOpacity="0.7" />
      </g>
      <circle cx="70" cy="70" r="5" fill="#e8c547" />
      <g className="arrow">
        <g className="shaft">
          <line x1="130" y1="98" x2="262" y2="98" stroke="#f5f0e8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M122 98 L136 91 L136 105 Z" fill="#e8c547" />
          <path d="M254 98 L272 88 M254 98 L272 108 M262 98 L280 88 M262 98 L280 108" stroke="#ff3b3b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547]">Error 404</p>

      <h1
        className="mt-4 select-none text-[clamp(6rem,24vw,15rem)] font-bold leading-[0.85] tracking-[-0.04em] text-transparent"
        style={{
          fontFamily: 'var(--font-serif)',
          backgroundImage: 'linear-gradient(180deg, #e8c547 0%, rgba(232,197,71,0.08) 92%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
        }}
        aria-label="404"
      >
        404
      </h1>

      <div className="mt-8 w-full">
        <MissedShot />
      </div>

      <h2 className="mt-8 text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#f5f0e8]" style={{ fontFamily: 'var(--font-display)' }}>
        Off target.
      </h2>
      <p className="mt-4 max-w-[44ch] text-[1rem] leading-8 text-[#f5f0e8]/65">
        The page you were aiming for isn&apos;t here. It may have moved, or the link may be off by a few millimetres.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#e8c547] px-6 py-3 text-sm font-semibold tracking-[0.02em] text-[#0a0a0a] transition-transform duration-200 hover:scale-[1.04]"
        >
          Back to the studio <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/team"
          className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold tracking-[0.02em] text-[#f5f0e8] transition-colors duration-200 hover:border-[#e8c547]/70 hover:text-[#e8c547]"
        >
          Meet the team
        </Link>
      </div>

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-[#f5f0e8]/35">
        Or press <kbd className="rounded border border-white/20 px-1.5 py-0.5">Ctrl</kbd> <kbd className="rounded border border-white/20 px-1.5 py-0.5">K</kbd> to search
      </p>
    </main>
  );
}
