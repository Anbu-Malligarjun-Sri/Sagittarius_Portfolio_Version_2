'use client';

import { ArrowRight } from 'lucide-react';

// A prototype is a scoped deliverable, not a promise of a fixed duration or commercial terms.
const WAYS = [
  {
    step: '01',
    name: 'A conversation',
    body: 'Tell us what slows you down. We will say plainly whether we can help, and if we cannot, who might.',
    note: 'No preparation needed',
  },
  {
    step: '02',
    name: 'A working prototype',
    body: 'One important workflow, made tangible: a clickable interface or a small working AI proof of concept, with a walkthrough and notes on what still needs testing.',
    note: 'One workflow. Something you can try.',
    featured: true,
  },
  {
    step: '03',
    name: 'A first build',
    body: 'A small, scoped piece of real work with checkpoints along the way, so you approve each step before the next one starts.',
    note: 'Scope and terms agreed together',
  },
];

export default function StartSection() {
  return (
    <section id="start" className="section-block scroll-mt-28 bg-[#1c2820] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547] header-anim-item">WAYS TO BEGIN</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] mt-4 header-anim-item">Start small. Start honestly.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">Start with the question that matters most. We agree what a useful first version should prove, then scope the time and cost around it.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-3">
        {WAYS.map((way) => (
          <article key={way.step} className="chalk-plan flex flex-col rounded-[4px] border-2 border-dashed border-white/30 p-6 text-[#f5f0e8] transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.06),inset_0_0_20px_rgba(255,255,255,0.02)]">
            {way.featured ? <div className="mb-4 inline-flex w-fit rotate-[-3deg] rounded-[4px] bg-[#e8c547] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#1c2820]">Make the idea tangible</div> : <div className="mb-4 h-[26px]" />}
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#e8c547]">{way.step}</div>
            <div className="mt-2 border-b border-white/15 pb-3 font-handwriting text-[clamp(2rem,3.4vw,2.6rem)] font-bold leading-none">{way.name}</div>
            <p className="mt-4 font-handwriting text-[19px] leading-7 text-[#f5f0e8]/90">{way.body}</p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f5f0e8]/55">○ {way.note}</p>
            {way.featured && <div className="mt-5 flex flex-wrap gap-2" aria-label="Prototype handover"><span className="border border-[#e8c547]/25 px-2 py-1 font-mono text-[10px] text-[#e8c547]">Interactive demo</span><span className="border border-[#e8c547]/25 px-2 py-1 font-mono text-[10px] text-[#e8c547]">Walkthrough</span><span className="border border-[#e8c547]/25 px-2 py-1 font-mono text-[10px] text-[#e8c547]">Known limits</span></div>}
            <a
              href="#contact"
              className="mt-auto inline-flex w-fit items-center gap-2 pt-8 font-handwriting text-[19px] font-bold text-[#e8c547] underline decoration-[#e8c547]/40 underline-offset-4 transition-colors hover:text-[#f5f0e8]"
            >
              Tell us about it <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
