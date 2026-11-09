'use client';

import EvidenceBoard from '@/features/process/EvidenceBoard';

interface ProcessSectionProps {
  activeSection: string;
}

export default function ProcessSection({ activeSection }: ProcessSectionProps) {
  return (
    <section id="process" className="section-block scroll-mt-28 bg-[#0d1b2a] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547] header-anim-item">HOW IT WORKS</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] mt-4 header-anim-item">A process that keeps decisions visible.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">Every stage, from requirements to maintenance, stays explicit so teams can see what changed and why.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl">
        <EvidenceBoard />
      </div>
    </section>
  );
}
