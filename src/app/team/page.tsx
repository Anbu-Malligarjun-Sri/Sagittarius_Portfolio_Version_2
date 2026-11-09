import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { FOUNDERS } from '@/features/team/founders';
import { teamFontVariables } from '@/features/team/fonts';
import Exhibit from '@/features/team/Exhibit';
import FounderCard from '@/features/team/FounderCard';
import HeroPortrait from '@/features/team/HeroPortrait';
import AssemblyChoreography from '@/features/team/AssemblyChoreography';
import styles from '@/features/team/team.module.css';

export const metadata: Metadata = {
  title: 'The Team',
  description: 'Meet the three founders behind Sagittariuz: Anbu Malligarjun Sri, Brajin S J and Arun G.',
  alternates: { canonical: '/team' },
};

const STATS = [
  { value: '03', label: 'Founders' },
  { value: '03', label: 'Disciplines' },
  { value: '01', label: 'Shared standard' },
];

// The hand: outer cards fan out a little, the middle one rises (large screens only).
const HAND = ['md:-rotate-[4deg] md:translate-y-5', 'md:z-10 md:-translate-y-2 md:scale-[1.04]', 'md:rotate-[4deg] md:translate-y-5'];

// Elements marked `data-assemble` are hidden at first and pulled into place by AssemblyChoreography.
// `data-from` is the side they arrive from; without it the side is chosen from the element's position.
export default function TeamPage() {
  const sited = FOUNDERS.filter((founder) => founder.link);

  return (
    <div
      data-team-root=""
      data-cursor-scale="1.6"
      className={`${teamFontVariables} ${styles.page} ${styles.pending} relative min-h-screen overflow-x-clip text-[#f5f0e8]`}
    >
      <noscript>
        <style>{'[data-assemble]{opacity:1!important}'}</style>
      </noscript>
      <div className="pointer-events-none fixed left-3 top-0 z-30 hidden h-full w-px bg-[#ff3b3b]/50 sm:block" />
      <AssemblyChoreography />

      <Link
        href="/"
        aria-label="Back to the main page"
        className="fixed left-5 top-4 z-40 inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-[rgba(10,10,12,0.8)] pl-3.5 pr-5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-2xl transition-all duration-200 hover:-translate-x-0.5 hover:border-[#ff3b3b] hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <main id="main-content">
        {/* ── Hero ── */}
        <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 lg:pt-32">
          <h1 data-assemble="" data-from="top" className={`${styles.outline} w-fit select-none text-[clamp(3.5rem,19.5vw,17rem)]`} aria-label="The team">
            THE TEAM
          </h1>

          <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <p data-assemble="" data-from="left" className="w-fit text-[2.2rem] leading-none text-white" style={{ fontFamily: 'var(--font-handwriting)' }}>
                <span className="inline-block -rotate-3">Hello, we&apos;re</span>
              </p>
              <p
                data-assemble=""
                data-from="left"
                className="mt-2 block w-fit bg-[#ff3b3b] px-4 py-1 text-[clamp(2.2rem,5.4vw,3.8rem)] font-extrabold leading-tight tracking-[-0.03em] text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                SAGITTARIUZ.
              </p>

              <p data-assemble="" data-from="left" className="mt-6 flex w-fit items-center gap-2 border border-white/15 bg-white/[0.03] px-3 py-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/80">
                <span className={`${styles.liveDot} h-1.5 w-1.5 rounded-full bg-[#ff3b3b]`} />
                Founding team · 03 operators
              </p>

              <p data-assemble="" data-from="left" className="mt-6 max-w-[48ch] text-[1.05rem] leading-8 text-white/72">
                Three founders, three very different ways of seeing, and one shared standard for the work we put our name on. Sagittariuz is the archer: aim first, then release.
              </p>

              <div data-assemble="" data-from="bottom" className="mt-8 flex w-fit flex-wrap gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
                <a href="#index" className="inline-flex items-center gap-2 bg-[#ff3b3b] px-5 py-3 text-white transition-transform hover:-translate-y-0.5">
                  Meet the founders <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <Link href="/#contact" className="inline-flex items-center gap-2 border border-white/25 px-5 py-3 text-white transition-colors hover:border-[#ff3b3b] hover:text-[#ff3b3b]">
                  Start a project
                </Link>
              </div>

              <dl data-assemble="" data-from="bottom" className="mt-12 flex w-fit flex-wrap gap-x-10 gap-y-4">
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
        <section id="index" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-8 pt-16">
          <p data-assemble="" data-from="left" className="w-fit font-mono text-[11px] tracking-[0.12em] text-white/55">{'//01.00 SEC_FOUNDERS INDEX [01/03]'}</p>
          <div data-assemble="" data-from="left" className="mt-8 w-fit">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-[#ff3b3b]">The founding team</p>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>
              Three founders. Three disciplines.
            </h2>
          </div>

          <div className="mt-14 grid gap-12 pb-6 md:grid-cols-3 md:gap-6">
            {FOUNDERS.map((founder, i) => (
              <div key={founder.id} className={HAND[i]}>
                <FounderCard founder={founder} index={i} />
              </div>
            ))}
          </div>
        </section>

        {FOUNDERS.map((founder, index) => (
          <Exhibit key={founder.id} founder={founder} index={index} />
        ))}

        {/* ── Direct connect ── */}
        <section className="mx-auto max-w-3xl px-6 pb-28 pt-16 text-center">
          <div data-assemble="" data-from="bottom">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-[#ff3b3b]">Direct connect</p>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>
              Let&apos;s aim at something extraordinary.
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-[1rem] leading-8 text-white/65">
              Tell us what you are building. One of the three of us will answer.
            </p>
          </div>
          <div data-assemble="" data-from="bottom" className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
          <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">© Sagittariuz · Built from first principles</p>
        </section>
      </main>
    </div>
  );
}
