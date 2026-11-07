import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { FOUNDERS } from '@/features/team/founders';
import { teamFontVariables } from '@/features/team/fonts';
import Exhibit from '@/features/team/Exhibit';
import HeroPortrait from '@/features/team/HeroPortrait';
import styles from '@/features/team/team.module.css';

export const metadata: Metadata = {
  title: 'The Team',
  description: 'Meet the three founders behind Sagittarius: Anbu Malligarjun Sri, Brajin S J and Arun G.',
  alternates: { canonical: '/team' },
};

const SHORT_ROLE = { anbu: 'CEO', brajin: 'CTO', arun: 'COO' } as const;

const STATS = [
  { value: '03', label: 'Founders' },
  { value: '03', label: 'Disciplines' },
  { value: '01', label: 'Shared standard' },
];

// Decorative multiplayer-style pointers, one per founder, drifting around the hero.
const POINTERS = [
  { id: 'anbu', drift: styles.driftA, pos: 'left-[4%] top-[34%]' },
  { id: 'brajin', drift: styles.driftB, pos: 'right-[6%] top-[28%]' },
  { id: 'arun', drift: styles.driftC, pos: 'left-[46%] top-[62%]' },
] as const;

function Pointer({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-start">
      <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
        <path d="M2 2 L2 18 L6.5 13.5 L10 21 L13 19.6 L9.6 12.4 L16 12.4 Z" fill={color} stroke="#060608" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span className="-ml-0.5 mt-4 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#060608]" style={{ backgroundColor: color }}>
        {label}
      </span>
    </div>
  );
}

export default function TeamPage() {
  const sited = FOUNDERS.filter((founder) => founder.link);

  return (
    <div className={`${teamFontVariables} ${styles.page} relative min-h-screen overflow-x-clip text-[#f5f0e8]`}>
      <div className="pointer-events-none fixed left-3 top-0 z-30 hidden h-full w-px bg-[#ff3b3b]/50 sm:block" />

      <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-3">
        <div className="flex h-12 w-full max-w-3xl items-center justify-between rounded-full border border-white/10 bg-[rgba(10,10,12,0.8)] px-4 backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-2.5 font-mono text-[11px] font-bold tracking-[0.18em] text-white">
            <span className="flex h-6 w-6 items-center justify-center bg-[#ff3b3b] text-[10px] text-white">SG</span>
            SAGITTARIUS
          </Link>
          <nav className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.22em] text-white/65">
            <a href="#index" className="transition-colors hover:text-white">Founders</a>
            <Link href="/#contact" className="transition-colors hover:text-white">Contact</Link>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* ── Hero ── */}
        <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 lg:pt-32">
          <h1 className={`${styles.outline} ${styles.rise} select-none text-[clamp(3.5rem,19.5vw,17rem)]`} aria-label="The team">
            THE TEAM
          </h1>

          {POINTERS.map(({ id, drift, pos }) => {
            const founder = FOUNDERS.find((f) => f.id === id)!;
            return (
              <div key={id} className={`${styles.cursor} ${drift} ${pos} z-20 hidden md:block`}>
                <Pointer color={founder.field} label={founder.name.split(' ')[0]} />
              </div>
            );
          })}

          <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <p className={`${styles.rise} -rotate-3 text-[2.2rem] leading-none text-white`} style={{ fontFamily: 'var(--font-handwriting)', animationDelay: '0.15s' }}>
                Hello, we&apos;re
              </p>
              <p
                className={`${styles.rise} mt-2 inline-block bg-[#ff3b3b] px-4 py-1 text-[clamp(2.2rem,5.4vw,3.8rem)] font-extrabold leading-tight tracking-[-0.03em] text-white`}
                style={{ fontFamily: 'var(--font-display)', animationDelay: '0.25s' }}
              >
                SAGITTARIUS.
              </p>

              <p className={`${styles.rise} mt-6 inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-3 py-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/80`} style={{ animationDelay: '0.35s' }}>
                <span className={`${styles.liveDot} h-1.5 w-1.5 rounded-full bg-[#ff3b3b]`} />
                Founding team · 03 operators
              </p>

              <p className={`${styles.rise} mt-6 max-w-[48ch] text-[1.05rem] leading-8 text-white/72`} style={{ animationDelay: '0.45s' }}>
                Three founders, three very different ways of seeing, and one shared standard for the work we put our name on. Sagittarius is the archer: aim first, then release.
              </p>

              <div className={`${styles.rise} mt-8 flex flex-wrap gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]`} style={{ animationDelay: '0.55s' }}>
                <a href="#index" className="inline-flex items-center gap-2 bg-[#ff3b3b] px-5 py-3 text-white transition-transform hover:-translate-y-0.5">
                  Meet the founders <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <Link href="/#contact" className="inline-flex items-center gap-2 border border-white/25 px-5 py-3 text-white transition-colors hover:border-[#ff3b3b] hover:text-[#ff3b3b]">
                  Start a project
                </Link>
              </div>

              <dl className={`${styles.rise} mt-12 flex flex-wrap gap-x-10 gap-y-4`} style={{ animationDelay: '0.65s' }}>
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{stat.label}</dt>
                    <dd className="order-first text-[2rem] font-extrabold leading-none text-[#ff3b3b]" style={{ fontFamily: 'var(--font-display)' }}>
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <HeroPortrait />
          </div>
        </section>

        {/* ── Index ── */}
        <section id="index" className={`${styles.reveal} mx-auto max-w-6xl scroll-mt-24 px-6 pb-8 pt-16`}>
          <p className="font-mono text-[11px] tracking-[0.12em] text-white/55">{'//01.00 SEC_FOUNDERS INDEX [01/03]'}</p>
          <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-[#ff3b3b]">The founding team</p>
          <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>
            Three founders. Three disciplines.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {FOUNDERS.map((founder, i) => (
              <a
                key={founder.id}
                href={`#${founder.id}`}
                className={`${styles.card} block border p-6 ${i === 0 ? 'border-[#ff3b3b]' : 'border-white/15'}`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span className="bg-[#ff3b3b]/15 px-2 py-1 font-bold text-[#ff3b3b]">{founder.role}</span>
                  <span className="text-white/40">#SYS-0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-[2rem] leading-[1] text-white" style={{ fontFamily: founder.nameFont }}>
                  {founder.name}
                </h3>
                <p className="mt-3 text-[13.5px] leading-6 text-white/65">{founder.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {founder.focus.map((tag) => (
                    <span key={tag} className="border border-white/15 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{SHORT_ROLE[founder.id]} → profile</p>
              </a>
            ))}
          </div>
        </section>

        {FOUNDERS.map((founder, index) => (
          <Exhibit key={founder.id} founder={founder} index={index} />
        ))}

        {/* ── Direct connect ── */}
        <section className={`${styles.reveal} mx-auto max-w-3xl px-6 pb-28 pt-16 text-center`}>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-[#ff3b3b]">Direct connect</p>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>
            Let&apos;s aim at something extraordinary.
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-[1rem] leading-8 text-white/65">
            Tell us what you are building. One of the three of us will answer.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/#contact" className="inline-flex items-center gap-2 bg-[#ff3b3b] px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5">
              Start a project <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {sited.map((founder) => (
              <a
                key={founder.id}
                href={founder.link!.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 px-4 py-3 font-mono text-[11px] tracking-[0.1em] text-white/80 transition-colors hover:border-[#ff3b3b] hover:text-white"
              >
                {founder.link!.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
          <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">© Sagittarius · Built from first principles</p>
        </section>
      </main>
    </div>
  );
}
