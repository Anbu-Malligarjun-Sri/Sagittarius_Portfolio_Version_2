'use client';

import { AnimatedCount, glassCardClass } from './utils';

interface AboutSectionProps {
  activeSection: string;
}

export default function AboutSection({ activeSection }: AboutSectionProps) {
  return (
    <section id="about" className="section-block scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547] header-anim-item">ABOUT</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] mt-4 header-anim-item">Twelve years of work that started with the same question.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">What must this product do, and who does it serve? We've asked that on every project since 2012, across 200 engagements and 40 countries.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-[1fr_24px_1fr]">
        <article className="relative overflow-hidden rounded-none border border-black/10 bg-[#f9f5ed] px-8 py-10 text-[#2a2015] shadow-[4px_4px_20px_rgba(0,0,0,0.15),-2px_0_8px_rgba(0,0,0,0.05)] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_27px,rgba(100,100,150,0.12)_28px)] before:content-['']">
          <div className="relative rotate-[-1.5deg]">
            <p className="font-handwriting text-[clamp(2.3rem,4vw,3.6rem)] font-bold leading-none">We sketch the shape before we ship the system.</p>
            <p className="mt-5 max-w-xl text-[14px] leading-8">Every project starts with the same note on the page: what must this product do, what must it not do, and where does the team need clarity faster than more features?</p>
            <p className="mt-5 text-[14px] leading-8">The answer usually lives between a circled word, a crossed-out assumption, and a small line of underlined text in ember orange.</p>
            <p className="mt-6 inline-flex rounded-full border-2 border-[#e85d24] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.35em]">Focus</p>
            <div className="mt-6 h-8 w-8 border-l-2 border-b-2 border-[#e85d24] rotate-12" />
          </div>
        </article>

        <div className="hidden bg-[linear-gradient(to_right,rgba(0,0,0,0.08),rgba(0,0,0,0.02),rgba(0,0,0,0.08))] lg:block" />

        <article className="relative overflow-hidden rounded-none border border-white/10 bg-[#fefcf8] px-8 py-10 text-[#1a1208] shadow-[0_14px_40px_rgba(0,0,0,0.2)]">
          <p className="max-w-prose text-[14px] leading-8">Sagittariuz began as a small studio for founders who wanted design and engineering to feel like one decision, not two different disciplines.</p>
          <p className="mt-4 max-w-prose text-[14px] leading-8">We pair editorial structure with product rigor so teams can launch with confidence, tighten the message, and keep the system maintainable after the first release.</p>
          <div className="absolute bottom-6 right-6 rotate-[5deg] border-2 border-black/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.35em] text-black/60">
            Est. 2024
          </div>
        </article>
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['12+ Years', 12],
          ['200+ Projects', 200],
          ['40+ Clients', 40],
          ['98% Retention', 98],
        ].map(([label, target], index) => (
          <div
            key={label}
            className={`${glassCardClass('postit-card relative min-h-30 px-5 py-6')}`}
            style={{ transform: `rotate(${[-4, 5, -2, 3][index]}deg)` }}
          >
            <div className="mx-auto mb-3 h-2 w-12 rounded-xs bg-[#e8c547]/25" />
            <div className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold text-[#e8c547]">
              <AnimatedCount target={Number(target)} active={activeSection === 'about'} />
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-[#f5f0e8]/60">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
