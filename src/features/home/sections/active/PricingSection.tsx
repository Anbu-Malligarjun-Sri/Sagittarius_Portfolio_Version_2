'use client';

import { PRICING } from './data';

interface PricingSectionProps {
  activeSection: string;
}

export default function PricingSection({ activeSection }: PricingSectionProps) {
  return (
    <section id="pricing" className="section-block scroll-mt-28 bg-[#1c2820] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547] header-anim-item">PRICING</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] mt-4 header-anim-item">Packages sized to how you buy.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">Pick a starting point that matches the amount of structure you need, then scale from there.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-3">
        {PRICING.map((plan) => (
          <article key={plan.name} className="chalk-plan rounded-[4px] border-2 border-dashed border-white/30 p-6 text-[#f5f0e8] transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.06),inset_0_0_20px_rgba(255,255,255,0.02)]">
            {plan.popular ? <div className="mb-4 inline-flex rotate-[-3deg] rounded-[4px] bg-[#e8c547] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#1c2820]">Chef&apos;s special</div> : null}
            <div className="font-handwriting text-[24px] font-bold">{plan.name}</div>
            <div className="mt-3 border-b border-white/15 pb-3 text-[clamp(2rem,4vw,3.5rem)] font-display font-bold text-[#e8c547]">{plan.price}</div>
            <ul className="mt-4 space-y-3 font-handwriting text-[14px] leading-7">
              {plan.details.map((detail) => <li key={detail}>○ {detail}</li>)}
            </ul>
            <button type="button" className="mt-8 rounded-[2px] bg-[#f5f0e8] px-6 py-3 font-handwriting text-[16px] font-bold text-[#1c2820] transition-colors duration-200 hover:bg-[#e8e4dc]">
              Reserve a spot
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
